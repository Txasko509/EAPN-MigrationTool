using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MigrationTool.DecisionTrees.Core.API.DataContracts;
using MigrationTool.DecisionTrees.Core.Repositories.Contracts;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using DC = MigrationTool.DecisionTrees.Core.API.DataContracts;
using S = MigrationTool.DecisionTrees.Core.Repositories.Model;

namespace MigrationTool.DecisionTrees.Core.API.Controllers
{
    [Route("api/decision-trees")]
    [ApiController]
    public class DecisionTreeController : Controller
    {
        private readonly IDecisionTreeRepository _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<DecisionTreeController> _logger;

        public DecisionTreeController(IDecisionTreeRepository repository, IMapper mapper, ILogger<DecisionTreeController> logger)
        {
            _repository = repository;
            _mapper = mapper;
            _logger = logger;
        }

        #region GET
        /// <summary>
        /// Get a list of decision trees, optionally can filter them
        /// </summary>
        /// <param name="limit">Limit - At least 1 and max 100</param>
        /// <param name="offset">Offset - For pagination</param>
        /// <param name="sort">Sort</param>
        /// <param name="fromDate">From date</param>
        /// <param name="toDate">To date</param>
        /// <param name="searchText">text to search</param>
        /// <returns></returns>
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<DC.DecisionTreeList>))]
        [ProducesResponseType(StatusCodes.Status204NoContent, Type = typeof(IEnumerable<DC.DecisionTreeList>))]
        [HttpGet, Route("")]
        public async Task<IEnumerable<DC.DecisionTreeList>> Search([Range(1, 100)] int? limit = 10, [Range(0, int.MaxValue)] int? offset = 0, string sort = null, DateTime? fromDate = null, DateTime? toDate = null, string searchText = null)
        {
            if (toDate.HasValue) toDate = toDate.Value.AddHours(23).AddMinutes(59).AddSeconds(59);

            var findByProperties = new FindByParams(searchText) { Limit = limit, Offset = offset, Sort = sort };

            var decisionTrees = await _repository.SearchByPropertiesAsync(fromDate, toDate, findByProperties.Query,
                findByProperties, findByProperties);

            return _mapper.Map<IEnumerable<DC.DecisionTreeList>>(decisionTrees);
        }

        /// <summary>
        /// Get a decision tree
        /// <param name="decisionTreeId">decisionTree identifier</param>
        /// </summary>
        /// <returns></returns>
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DC.DecisionTreeDetail))]
        [ProducesResponseType(StatusCodes.Status204NoContent, Type = typeof(DC.DecisionTreeDetail))]
        [HttpGet, Route("{decisionTreeId}")]
        public async Task<DC.DecisionTreeDetail> GetAsync(int decisionTreeId)
        {
            var decisionTree = await _repository.GetAsync(decisionTreeId);

            return _mapper.Map<DC.DecisionTreeDetail>(decisionTree);
        }
        #endregion

        #region POST     
        /// <summary>
        /// Creates a decision tree.
        /// </summary>
        /// <param name="value">new decision tree</param>
        /// <returns>Return true if the decision tree is created correctly, false in another case.</returns>
        /// <response code="201">Returns the newly created item.</response>
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(Boolean))]
        [HttpPost]
        public async Task<Boolean> Create([FromBody] DC.SaveDecisionTree value)
        {
            var data = await _repository.CreateAsync(_mapper.Map<S.DecisionTree>(value));

            if (data == null)
            {
                await RaiseException("Error on decision tree create");
            }

            return true;
        }
        #endregion

        #region PUT
        /// <summary>
        /// Updates a decision tree entity.
        /// </summary>
        /// <remarks>
        /// No remarks.
        /// </remarks>
        /// <param name="decisionTreeId"></param>
        /// <param name="value"></param>
        /// <returns>
        /// Returns a boolean notifying if the decision tree has been updated properly.
        /// </returns>
        /// <response code="200">Returns a boolean notifying if the decision tree has been updated properly.</response>        
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(bool))]
        [HttpPut, Route("{decisionTreeId}")]
        public async Task<bool> Update(int decisionTreeId, [FromBody] DC.SaveDecisionTree value)
        {
            _logger.LogDebug($"DecisionTreeControllers::Put::");

            if (value == null)
                throw new ArgumentNullException("value");

            return await _repository.UpdateAsync(decisionTreeId, _mapper.Map<S.DecisionTree>(value));
        }
        #endregion


        #region DELETE
        /// <summary>
        /// Remove decision tree 
        /// </summary>
        /// <remarks>
        /// No remarks.
        /// </remarks>
        /// <param name="decisionTreeId">decision tree Id</param>
        /// <returns>
        /// Boolean notifying if the decision tree has been removed properly.
        /// </returns>
        /// <response code="200">Boolean notifying if the decision tree has been removed properly.</response>        
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(bool))]
        [HttpDelete("{decisionTreeId}")]
        public async Task<bool> Remove(int decisionTreeId)
        {
            _logger.LogDebug($"DecisionTreeController::Delete::");

            return await _repository.RemoveAsync(decisionTreeId);
        }
        #endregion

        #region Exceptions
        [HttpGet("exception/{message}")]
        [ProducesErrorResponseType(typeof(Exception))]
        public async Task RaiseException(string message)
        {
            _logger.LogError($"DecisionTreeController::RaiseException::{message}");

            throw new Exception(message);
        }
        #endregion
    }
}
