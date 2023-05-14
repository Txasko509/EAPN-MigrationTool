using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MigrationTool.DecisionTrees.Core.Repositories.Contracts;
using System.Threading.Tasks;
using DC = MigrationTool.DecisionTrees.Core.API.DataContracts;
using S = MigrationTool.DecisionTrees.Core.Repositories.Model;

namespace MigrationTool.DecisionTrees.Core.API.Controllers
{
    [Route("api/decision-tree")]
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
        /// Get a decision tree
        /// <param name="decisionTreeId">decisionTree identifier</param>
        /// </summary>
        /// <returns></returns>
        //[ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DC.DecisionTreeDetail))]
        //[ProducesResponseType(StatusCodes.Status204NoContent, Type = typeof(DC.DecisionTreeDetail))]
        [HttpGet, Route("{decisionTreeId}")]
        public async Task<object> GetAsync(int decisionTreeId)
        {
            var decisionTree = await _repository.GetAsync(decisionTreeId);

            return _mapper.Map<DC.DecisionTreeDetail>(decisionTree);
        }
        #endregion
    }
}
