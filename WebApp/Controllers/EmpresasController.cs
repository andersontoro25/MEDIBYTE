using DevExtreme.AspNet.Data;

using DevExtreme.AspNet.Data.ResponseModel;
using DevExtreme.AspNet.Mvc;
using Dominus.Frontend.Controllers;
using Blazor.Infrastructure.Entities;
using Blazor.WebApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using Newtonsoft.Json;
using Blazor.BusinessLogic;
using System.IO;
using Dominus.Backend.Application;
using System.Threading.Tasks;

namespace Blazor.WebApp.Controllers
{

    [Authorize]
    public partial class EmpresasController : BaseAppController
    {

        //private const string Prefix = "Empresas"; 

        public EmpresasController(IConfiguration config, IHttpContextAccessor httpContextAccessor) : base(config, httpContextAccessor)
        {
        }

        #region Functions Master

        [HttpPost]
        public LoadResult Get(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<Empresas>().Tabla(true), loadOptions);
        }

        public IActionResult List()
        {
            var empresa = Manager().GetBusinessLogic<Empresas>().Tabla().FirstOrDefault();
            return View("Edit", EditModel(empresa.Id));
        }

        public IActionResult ListPartial()
        {
            var empresa = Manager().GetBusinessLogic<Empresas>().Tabla().FirstOrDefault();
            return PartialView("Edit", EditModel(empresa.Id));
        }

        [HttpGet]
        public IActionResult Edit(long Id)
        {
            return PartialView("Edit", EditModel(Id));
        }

        private EmpresasModel EditModel(long Id)
        {
            EmpresasModel model = new EmpresasModel();
            model.Entity = Manager().GetBusinessLogic<Empresas>().FindById(x => x.Id == Id, true);
            if (model.Entity.CiudadesId > 0)
            {
                Ciudades ciudades = Manager().GetBusinessLogic<Ciudades>().FindById(x => x.Id == model.Entity.CiudadesId, true);
                model.DepartamentosId = ciudades.Departamentos.Id;
                model.PaisesId = ciudades.Departamentos.PaisesId;
            }

            if (model.Entity.LogoArchivos == null)
                model.Entity.LogoArchivos = new Archivos();
            else
                model.Entity.LogoArchivos.StringToBase64 = DApp.Util.ArrayBytesToString(model.Entity.LogoArchivos.Archivo);


            model.Entity.IsNew = false;
            return model;
        }

        [HttpPost]
        public IActionResult Edit(EmpresasModel model)
        {
            return PartialView("Edit", EditModel(model));
        }

        private EmpresasModel EditModel(EmpresasModel model)
        {
            ViewBag.Accion = "Save";
            var OnState = model.Entity.IsNew;
            if (ModelState.IsValid)
            {
                try
                {
                    model.Entity.LastUpdate = DateTime.Now;
                    model.Entity.UpdatedBy = User.Identity.Name;

                    model.Entity.NumeroIdentificacion = DApp.Util.QuitarEspacios(model.Entity.NumeroIdentificacion);
                    model.Entity.RazonSocial = DApp.Util.QuitarEspacios(model.Entity.RazonSocial);
                    model.Entity.Celular = DApp.Util.QuitarEspacios(model.Entity.Celular);
                    model.Entity.Telefono = DApp.Util.QuitarEspacios(model.Entity.Telefono);
                    model.Entity.CorreoElectronico = DApp.Util.QuitarEspacios(model.Entity.CorreoElectronico);
                    model.Entity.Direccion = DApp.Util.QuitarEspacios(model.Entity.Direccion);
                    model.Entity.CodigoReps = DApp.Util.QuitarEspacios(model.Entity.CodigoReps);

                    if (model.Entity.IsNew)
                    {
                        model.Entity.CreationDate = DateTime.Now;
                        model.Entity.CreatedBy = User.Identity.Name;
                        model.Entity = Manager().GetBusinessLogic<Empresas>().Add(model.Entity);
                        model.Entity.IsNew = false;
                    }
                    else
                    {
                        model.Entity = Manager().GetBusinessLogic<Empresas>().Modify(model.Entity);
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

        #endregion

        #region Functions Detail 
        /*

        [HttpGet]
        public IActionResult NewDetail(long IdFather)
        {
            return PartialView("EditDetail", NewModelDetail(IdFather));
        }

        private EmpresasModel NewModelDetail(long IdFather) 
        { 
            EmpresasModel model = new EmpresasModel(); 
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
        public IActionResult EditDetail(EmpresasModel model)
        {
            return PartialView("EditDetail",EditModel(model));
        }

        [HttpPost]
        public IActionResult DeleteDetail(EmpresasModel model)
        {
            return PartialView("EditDetail", DeleteModelDetail(model));
        }

        private EmpresasModel DeleteModelDetail(EmpresasModel model)
        { 
            ViewBag.Accion = "Delete"; 
            EmpresasModel newModel = NewModelDetail(model.Entity.IdFather); 
            if (ModelState.IsValid) 
            { 
                try 
                { 
                    model.Entity = Manager().GetBusinessLogic<Empresas>().FindById(x => x.Id == model.Entity.Id, false); 
                    Manager().GetBusinessLogic<Empresas>().Remove(model.Entity); 
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
             Empresas entity = new Empresas(); 
             JsonConvert.PopulateObject(values, entity); 
             EmpresasModel model = new EmpresasModel(); 
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
             Empresas entity = Manager().GetBusinessLogic<Empresas>().FindById(x => x.Id == key, false); 
             JsonConvert.PopulateObject(values, entity); 
             EmpresasModel model = new EmpresasModel(); 
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
             Empresas entity = Manager().GetBusinessLogic<Empresas>().FindById(x => x.Id == key, false); 
             Manager().GetBusinessLogic<Empresas>().Remove(entity); 
        } 

        */
        #endregion

        #region Datasource Combobox Foraneos 
        [HttpPost]
        public LoadResult GetTiposRegimenContableId(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<TiposRegimenContable>().Tabla(true), loadOptions);
        }
        [HttpPost]
        public LoadResult GetCiudadesId(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<Ciudades>().Tabla(true), loadOptions);
        }
        [HttpPost]
        public LoadResult GetTiposIdentificacionId(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<TiposIdentificacion>().Tabla(true), loadOptions);
        }
        [HttpPost]
        public LoadResult GetTiposIdentificacionRepresentanteLegalId(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<TiposIdentificacion>().Tabla(true), loadOptions);
        }
        [HttpPost]
        public LoadResult GetDepartamentosId(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<Departamentos>().Tabla(true), loadOptions);
        }
        [HttpPost]
        public LoadResult GetPaisesId(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<Paises>().Tabla(true), loadOptions);
        }

        [HttpPost]
        public LoadResult GetEmpresasId(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<Empresas>().Tabla(true), loadOptions);
        }
        #endregion

        [HttpPost]
        public IActionResult UploadFile(string Property)
        {
            try
            {
                IFormFile myFile = Request.Form.Files["Entity." + Property];
                // Uncomment to save the file
                string fileTemp = Path.Combine(Path.GetTempPath(), Guid.NewGuid() + myFile.FileName);
                using (var fileStream = System.IO.File.Create(fileTemp))
                {
                    myFile.CopyTo(fileStream);
                }

                return Ok(fileTemp);
            }
            catch (Exception e) { return BadRequest(e.Message); }
        }

        public IActionResult DownloadFiles(int Id)
        {
            Archivos model = new Archivos();
            model = Manager().GetBusinessLogic<Archivos>().FindById(x => x.Id == Id, true);
            return File(model.Archivo, model.TipoContenido, model.Nombre);
        }

        //[HttpGet]
        //public async Task<IActionResult> ObtenerXMLNotaDebito(int id)
        //{
        //    var xml = await Manager().NotasBusinessLogic().ObtenerXMLNotaDebito(id);
        //    var path = Path.GetTempFileName();
        //    System.IO.File.WriteAllText(path, xml);
        //    var bytes = System.IO.File.ReadAllBytes(path);
        //    return File(bytes, "text/xml", $"Nota_{id}.xml");
        //}

        //[HttpGet]
        //public async Task<IActionResult> ObtenerXMLNotaCredito(int id)
        //{
        //    var xml = await Manager().NotasBusinessLogic().ObtenerXMLNotaCredito(id);
        //    var path = Path.GetTempFileName();
        //    System.IO.File.WriteAllText(path, xml);
        //    var bytes = System.IO.File.ReadAllBytes(path);
        //    return File(bytes, "text/xml", $"Nota_{id}.xml");
        //}

        [HttpGet]
        public async Task<IActionResult> ObtenerXMLFactura(int id)
        {
            var xmlDian = await Manager().FacturasBusinessLogic().GetArchivoXmlDIAN(id,  User.Identity.Name, Request.Host.Value);
            return File(xmlDian.ContentBytes, xmlDian.ContentType, xmlDian.FileName);
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerJsonRips(int id)
        {
            var json = await Manager().FacturasBusinessLogic().GetRipsJson(id, User.Identity.Name, Request.Host.Value);
            var path = Path.GetTempFileName();
            System.IO.File.WriteAllText(path, json);
            var bytes = System.IO.File.ReadAllBytes(path);
            return File(bytes, "application/json", $"Factura_{id}_Rips.json");
        }

        [HttpGet]
        public IActionResult ObtenerJsonFacturaFE(int id)
        {
            var json = Manager().FacturasBusinessLogic().GetFEJson(id);
            var path = Path.GetTempFileName();
            System.IO.File.WriteAllText(path, json);
            var bytes = System.IO.File.ReadAllBytes(path);
            return File(bytes, "application/json", $"Factura_{id}_FE.json");
        }

        [HttpGet]
        public IActionResult ObtenerJsonNotaDebitoFE(int id)
        {
            var json = Manager().NotasBusinessLogic().GetFENotaDebitoJson(id);
            var path = Path.GetTempFileName();
            System.IO.File.WriteAllText(path, json);
            var bytes = System.IO.File.ReadAllBytes(path);
            return File(bytes, "application/json", $"NotaDebito_{id}_FE.json");
        }

        [HttpGet]
        public IActionResult ObtenerJsonNotaCreditoFE(int id)
        {
            var json = Manager().NotasBusinessLogic().GetFENotaCreditoJson(id);
            var path = Path.GetTempFileName();
            System.IO.File.WriteAllText(path, json);
            var bytes = System.IO.File.ReadAllBytes(path);
            return File(bytes, "application/json", $"NotaCredito_{id}_FE.json");
        }
    }
}
