﻿using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace MigrationTool.DecisionTrees.Core.API.Common.Middlewares
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILoggerFactory loggerFactory)
        {
            this._next = next;
            this._logger = loggerFactory.CreateLogger<ErrorHandlingMiddleware>();
        }

        public async Task Invoke(HttpContext context /* other dependencies */)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var code = HttpStatusCode.InternalServerError; // 500 if unexpected

            if (exception is ArgumentNullException) code = HttpStatusCode.BadRequest;
            else if (exception is ArgumentException) code = HttpStatusCode.BadRequest;
            else if (exception is UnauthorizedAccessException) code = HttpStatusCode.Unauthorized;

            this._logger.LogError($"GLOBAL ERROR HANDLER::HTTP:{code}::{exception.Message}");

            //New feature to avoid recursive serialization issues. However, it seems there are still errors which avoid using System.Text.Json instead of Newtonsoft.
            //https://devblogs.microsoft.com/dotnet/announcing-net-5-0-rc-1/
            //Known issue for now in System.Text.Json
            var result = JsonSerializer.Serialize<Exception>(exception, new JsonSerializerOptions { WriteIndented = true });

            //Newtonsoft.Json serializer (should be replaced once the known issue in System.Text.Json will be solved)
            //var result = JsonConvert.SerializeObject(exception, Formatting.Indented);

            context.Response.Clear();
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;
            return context.Response.WriteAsync(result);
        }
    }
}
