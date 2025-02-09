using Blazor.BusinessLogic;
using Blazor.Infrastructure.Entities;
using Blazor.WebApp.Models;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using DevExtreme.AspNet.Mvc;
using Dominus.Frontend.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;


namespace Blazor.WebApp.Controllers
{

    [Authorize] 
    public partial class CajasController : BaseAppController
    {

        //private const string Prefix = "Cajas"; 

        public CajasController(IConfiguration config, IHttpContextAccessor httpContextAccessor) : base(config, httpContextAccessor)
        {
        }

        #region Functions Master

        [HttpPost]
        public LoadResult Get(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<Cajas>().Tabla(true), loadOptions);
        }

        public IActionResult List()
        {
            return View("List");
        }

        public IActionResult ListPartial()
        {
            return PartialView("List");
        }

        [HttpGet]
        public IActionResult New()
        {
            return PartialView("Edit", NewModel());
        }

        private CajasModel NewModel() 
        { 
            CajasModel model = new CajasModel();
            model.Entity.IsNew = true;
            return model; 
        } 

        [HttpGet]
        public IActionResult Edit(long Id)
        {
            return PartialView("Edit", EditModel(Id));
        }

        private CajasModel EditModel(long Id) 
        { 
            CajasModel model = new CajasModel();
            model.Entity = Manager().GetBusinessLogic<Cajas>().FindById(x => x.Id == Id, false);
            model.Entity.IsNew = false;
            return model; 
        } 

        [HttpPost]
        public IActionResult Edit(CajasModel model)
        {
            return PartialView("Edit",EditModel(model));
        }

        private CajasModel EditModel(CajasModel model) 
        { 
            ViewBag.Accion = "Save"; 
            var OnState = model.Entity.IsNew; 
            if (ModelState.IsValid) 
            { 
                try 
                { 
                    model.Entity.LastUpdate = DateTime.Now; 
                    model.Entity.UpdatedBy = User.Identity.Name; 
                    if (model.Entity.IsNew) 
                    { 
                        model.Entity.CreationDate = DateTime.Now; 
                        model.Entity.CreatedBy = User.Identity.Name; 
                        model.Entity = Manager().GetBusinessLogic<Cajas>().Add(model.Entity); 
                        model.Entity.IsNew = false;
                    } 
                    else 
                    { 
                        model.Entity = Manager().GetBusinessLogic<Cajas>().Modify(model.Entity); 
                    } 
                } 
                catch (Exception e) 
                { 
                    ModelState.AddModelError("Entity.Id", e.GetFrontFullErrorMessage()); 
                } 
            }
            else
            {
                ModelState.AddModelError("Entity.Id", $"Error en vista, diferencia con base de datos. | " + ModelState.GetModelFullErrorMessage());
            }
            return model; 
        } 

        [HttpPost]
        public IActionResult Delete(CajasModel model)
        {
            return PartialView("Edit", DeleteModel(model));
        }

        private CajasModel DeleteModel(CajasModel model)
        { 
            ViewBag.Accion = "Delete"; 
            CajasModel newModel = NewModel(); 
            if (ModelState.IsValid) 
            { 
                try 
                { 
                    model.Entity = Manager().GetBusinessLogic<Cajas>().FindById(x => x.Id == model.Entity.Id, false); 
                    Manager().GetBusinessLogic<Cajas>().Remove(model.Entity); 
                    return newModel;
                } 
                catch (Exception e) 
                { 
                    ModelState.AddModelError("Entity.Id", e.GetFrontFullErrorMessage()); 
                } 
            } 
            return model; 
        } 

        #endregion 

        #region Functions Detail 
        /*

        [HttpGet]
        public IActionResult NewDetail(long IdFather)
        {
            return PartialView("EditDetail", NewModelDetail(IdFather));
        }

        private CajasModel NewModelDetail(long IdFather) 
        { 
            CajasModel model = new CajasModel(); 
            model.Entity.IdFather = IdFather; 
            model.Entity.IsNew = true; 
            return model; 
        } 

        [HttpGet]
        public IActionResult EditDetail(long Id)
        {
            return PartialView("EditDetail", EditModel(Id));
        }

        [HttpPost]
        public IActionResult EditDetail(CajasModel model)
        {
            return PartialView("EditDetail",EditModel(model));
        }

        [HttpPost]
        public IActionResult DeleteDetail(CajasModel model)
        {
            return PartialView("EditDetail", DeleteModelDetail(model));
        }

        private CajasModel DeleteModelDetail(CajasModel model)
        { 
            ViewBag.Accion = "Delete"; 
            CajasModel newModel = NewModelDetail(model.Entity.IdFather); 
            if (ModelState.IsValid) 
            { 
                try 
                { 
                    model.Entity = Manager().GetBusinessLogic<Cajas>().FindById(x => x.Id == model.Entity.Id, false); 
                    Manager().GetBusinessLogic<Cajas>().Remove(model.Entity); 
                    return newModel;
                } 
                catch (Exception e) 
                { 
                    ModelState.AddModelError("Entity.Id", e.GetFullErrorMessage()); 
                } 
            } 
            return model; 
        } 

        #endregion 

        #region Funcions Detail Edit in Grid 

        [HttpPost] 
        public IActionResult AddInGrid(string values) 
        { 
             Cajas entity = new Cajas(); 
             JsonConvert.PopulateObject(values, entity); 
             CajasModel model = new CajasModel(); 
             model.Entity = entity; 
             model.Entity.IsNew = true; 
             this.EditModel(model); 
             if(ModelState.IsValid) 
                 return Ok(ModelState); 
             else 
                 return BadRequest(ModelState.GetFullErrorMessage()); 
        } 

        [HttpPost] 
        public IActionResult ModifyInGrid(int key, string values) 
        { 
             Cajas entity = Manager().GetBusinessLogic<Cajas>().FindById(x => x.Id == key, false); 
             JsonConvert.PopulateObject(values, entity); 
             CajasModel model = new CajasModel(); 
             model.Entity = entity; 
             model.Entity.IsNew = false; 
             this.EditModel(model); 
             if(ModelState.IsValid) 
                 return Ok(ModelState); 
             else 
                 return BadRequest(ModelState.GetFullErrorMessage()); 
        } 

        [HttpPost]
        public void DeleteInGrid(int key)
        { 
             Cajas entity = Manager().GetBusinessLogic<Cajas>().FindById(x => x.Id == key, false); 
             Manager().GetBusinessLogic<Cajas>().Remove(entity); 
        } 

        */
        #endregion 

        #region Datasource Combobox Foraneos 

        [HttpPost]
        public LoadResult GetSedesId(DataSourceLoadOptions loadOptions)
        { 
            return DataSourceLoader.Load(Manager().GetBusinessLogic<Sedes>().Tabla(true).Where(x => x.EstadosId == 37), loadOptions);
        } 
       #endregion

    }
}
