using Blazor.BusinessLogic;
using Blazor.Infrastructure.Entities;
using Blazor.Infrastructure.Models;
using Blazor.WebApp.Models;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using DevExtreme.AspNet.Mvc;
using Dominus.Backend.Application;
using Dominus.Frontend.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;


namespace Blazor.WebApp.Controllers
{

    [Authorize]
    public partial class ProgramacionCitasController : BaseAppController
    {

        //private const string Prefix = "ProgramacionCitas"; 

        public ProgramacionCitasController(IConfiguration config, IHttpContextAccessor httpContextAccessor) : base(config, httpContextAccessor)
        {
        }

        #region Functions Master

        [HttpPost]
        public LoadResult Get(DataSourceLoadOptions loadOptions)
        {
            if (this.ActualEntidadId() != 0)
                return DataSourceLoader.Load(Manager().GetBusinessLogic<ProgramacionCitas>().Tabla(true).Where(x => x.EntidadesId == this.ActualEntidadId()), loadOptions);
            else
                return DataSourceLoader.Load(Manager().GetBusinessLogic<ProgramacionCitas>().Tabla(true), loadOptions);
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

        private ProgramacionCitasModel NewModel()
        {
            ProgramacionCitasModel model = new ProgramacionCitasModel();
            model.Entity.IsNew = true;
            model.Entity.EmpresasId = this.ActualEmpresaId();
            model.Entity.Consecutivo = Manager().ProgramacionCitasBusinessLogic().GetSiguienteConsecutivo();
            model.Entity.Cantidad = 1;
            model.Entity.EstadosId = 10083;
            model.Entity.FechaInicio = DateTime.Now;
            model.Entity.FechaFinal = DateTime.Now.AddHours(24);
            model.Entity.HoraInicio = model.Entity.FechaInicio;
            model.Entity.HoraFinal = model.Entity.FechaFinal;
            //
            model.Entity.PorcDescAutorizado = 0.0m;

            model.PacientesModel.Entity.IsNew = true;
            model.PacientesModel.Entity.EmpresasId = this.ActualEmpresaId();
            model.PacientesModel.DesdeCitas = true;
            model.PacientesModel.CitaNueva = model.Entity.IsNew;
            return model;
        }

        [HttpGet]
        public IActionResult Edit(long Id)
        {
            return PartialView("Edit", EditModel(Id));
        }

        private ProgramacionCitasModel EditModel(long Id)
        {
            ProgramacionCitasModel model = new ProgramacionCitasModel();
            model.Entity = Manager().GetBusinessLogic<ProgramacionCitas>().FindById(x => x.Id == Id, false);
            model.Entity.IsNew = false;
            model.Entity.HoraInicio = model.Entity.FechaInicio;
            model.Entity.HoraFinal = model.Entity.FechaFinal;

            model.PacientesModel.Entity = Manager().GetBusinessLogic<Pacientes>().FindById(x => x.Id == model.Entity.PacientesId, true);
            if (model.PacientesModel.Entity.CiudadesId > 0)
            {
                Ciudades ciudad = Manager().GetBusinessLogic<Ciudades>().FindById(x => x.Id == model.PacientesModel.Entity.CiudadesId, true);
                model.PacientesModel.Entity.DepartamentoId = ciudad.DepartamentosId;
                model.PacientesModel.Entity.PaisesId = ciudad.Departamentos.PaisesId;
                model.PacientesModel.Entity.IsNew = false;
            }
            model.PacientesModel.DesdeCitas = true;
            model.PacientesModel.CitaNueva = model.Entity.IsNew;

            return model;
        }

        [HttpPost]
        public IActionResult Edit(ProgramacionCitasModel model)
        {
            return PartialView("Edit", EditModel(model));
        }

        private ProgramacionCitasModel EditModel(ProgramacionCitasModel model)
        {
            ViewBag.Accion = "Save";
            var OnState = model.Entity.IsNew;

            var keyPacientes = ModelState.Where(x => x.Key.Contains("PacientesModel.Entity")).Select(x => x.Key).ToList();
            foreach (var key in keyPacientes)
            {
                ModelState.Remove(key);
            }

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
                        model.Entity = Manager().GetBusinessLogic<ProgramacionCitas>().Add(model.Entity);
                        model.Entity.IsNew = false;
                    }
                    else
                    {
                        var horaCero = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0);
                        if (model.Entity.FechaInicio.TimeOfDay == horaCero.TimeOfDay)
                        {
                            throw new Exception("Por favor verificar la hora de inicio de la cita");
                        }

                        var citaBd = Manager().GetBusinessLogic<ProgramacionCitas>().FindById(x => x.Id == model.Entity.Id, false);
                        List<long> estados = new List<long> { 4, 5, 6, 7, 8, 9, 10078 };
                        if (!estados.Contains(citaBd.EstadosId))
                            citaBd.EstadosId = model.Entity.EstadosId;

                        citaBd.Observaciones = model.Entity.Observaciones;
                        citaBd.FechaInicio = model.Entity.FechaInicio;
                        citaBd.EmpleadosId = model.Entity.EmpleadosId;
                        citaBd.HoraInicio = model.Entity.HoraInicio;
                        citaBd.FechaFinal = model.Entity.FechaFinal;
                        citaBd.HoraFinal = model.Entity.HoraFinal;
                        citaBd.ConsultoriosId = model.Entity.ConsultoriosId;
                        citaBd.Duracion = model.Entity.Duracion;
                        citaBd.MotivoReprogramacion = model.Entity.MotivoReprogramacion;
                        citaBd.UpdatedBy = model.Entity.UpdatedBy;

                        model.Entity = Manager().GetBusinessLogic<ProgramacionCitas>().Modify(citaBd);
                    }

                    model = EditModel(model.Entity.Id);

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
        public IActionResult Delete(ProgramacionCitasModel model)
        {
            return PartialView("Edit", DeleteModel(model));
        }

        private ProgramacionCitasModel DeleteModel(ProgramacionCitasModel model)
        {
            ViewBag.Accion = "Delete";
            ProgramacionCitasModel newModel = NewModel();
            if (ModelState.IsValid)
            {
                try
                {
                    model.Entity = Manager().GetBusinessLogic<ProgramacionCitas>().FindById(x => x.Id == model.Entity.Id, false);
                    Manager().GetBusinessLogic<ProgramacionCitas>().Remove(model.Entity);
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

        private ProgramacionCitasModel NewModelDetail(long IdFather) 
        { 
            ProgramacionCitasModel model = new ProgramacionCitasModel(); 
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
        public IActionResult EditDetail(ProgramacionCitasModel model)
        {
            return PartialView("EditDetail",EditModel(model));
        }

        [HttpPost]
        public IActionResult DeleteDetail(ProgramacionCitasModel model)
        {
            return PartialView("EditDetail", DeleteModelDetail(model));
        }

        private ProgramacionCitasModel DeleteModelDetail(ProgramacionCitasModel model)
        { 
            ViewBag.Accion = "Delete"; 
            ProgramacionCitasModel newModel = NewModelDetail(model.Entity.IdFather); 
            if (ModelState.IsValid) 
            { 
                try 
                { 
                    model.Entity = Manager().GetBusinessLogic<ProgramacionCitas>().FindById(x => x.Id == model.Entity.Id, false); 
                    Manager().GetBusinessLogic<ProgramacionCitas>().Remove(model.Entity); 
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
             ProgramacionCitas entity = new ProgramacionCitas(); 
             JsonConvert.PopulateObject(values, entity); 
             ProgramacionCitasModel model = new ProgramacionCitasModel(); 
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
             ProgramacionCitas entity = Manager().GetBusinessLogic<ProgramacionCitas>().FindById(x => x.Id == key, false); 
             JsonConvert.PopulateObject(values, entity); 
             ProgramacionCitasModel model = new ProgramacionCitasModel(); 
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
             ProgramacionCitas entity = Manager().GetBusinessLogic<ProgramacionCitas>().FindById(x => x.Id == key, false); 
             Manager().GetBusinessLogic<ProgramacionCitas>().Remove(entity); 
        } 

        */
        #endregion

        #region Datasource Combobox Foraneos 

        [HttpPost]
        public LoadResult GetEstadosIdTipoDuracion(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<Estados>().Tabla(true).Where(x => x.Tipo == "SERVICIOSDURACION"), loadOptions);
        }

        [HttpPost]
        public LoadResult GetConsultoriosId(DataSourceLoadOptions loadOptions, long ServiciosId)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<Consultorios>().Tabla(true), loadOptions);
        }
        [HttpPost]
        public LoadResult GetEmpleadosId(DataSourceLoadOptions loadOptions, long ServiciosId)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<Empleados>().Tabla(true), loadOptions);
        }
        [HttpPost]
        public LoadResult GetEmpresasId(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<Empresas>().Tabla(true), loadOptions);
        }
        [HttpPost]
        public LoadResult GetEspecialidadesId(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<Especialidades>().Tabla(true), loadOptions);
        }
        [HttpPost]
        public LoadResult GetEstadosId(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<Estados>().Tabla(true), loadOptions);
        }
        [HttpPost]
        public LoadResult GetTiposCitasId(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<TiposCitas>().Tabla(true), loadOptions);
        }
        [HttpPost]
        public LoadResult GetPacientesId(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<Pacientes>().Tabla(true), loadOptions);
        }
        [HttpPost]
        public LoadResult GetSedesId(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<Sedes>().Tabla(true).Where(x => x.EstadosId == 37), loadOptions);
        }
        [HttpPost]
        public LoadResult GetConveniosByEntidad(DataSourceLoadOptions loadOptions, long EntidadesId)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<Convenios>().Tabla(true).Where(x => x.EntidadesId == EntidadesId), loadOptions);
            //return DataSourceLoader.Load(Manager().ProgramacionCitasBusinessLogic().GetConveniosByEntidad(EntidadesId), loadOptions);
        }
        [HttpPost]
        public LoadResult GetServiciosId(DataSourceLoadOptions loadOptions, long idConvenio, long idEntidad)
        {
            if (idEntidad == 0 && idConvenio == 0)
            {
                List<string> codes = new List<string> { "COP", "CM", "CR", "PC" };
                return DataSourceLoader.Load(Manager().GetBusinessLogic<Servicios>().Tabla(true).Where(x => x.EstadosId == 30 && !codes.Contains(x.Codigo)), loadOptions);
            }
            else
            {
                if (idConvenio != 0 && idEntidad != 0)
                {
                    var result = Manager().GetBusinessLogic<ConveniosServicios>().Tabla(true)
                    .Where(x => x.Servicios.EstadosId == 30 && x.ConveniosId == idConvenio)
                    .Select(x => x.Servicios);
                    return DataSourceLoader.Load(result, loadOptions);
                }
                else
                {
                    return DataSourceLoader.Load(new List<Servicios>(), loadOptions);
                }
            }
        }
        [HttpPost]
        public LoadResult GetEntidadesByPaciente(DataSourceLoadOptions loadOptions, long PacientesId)
        {
            var result = Manager().ProgramacionCitasBusinessLogic().GetEntidadesByPaciente(PacientesId, this.ActualEntidadId());
            return DataSourceLoader.Load(result, loadOptions);
        }
        [HttpPost]
        public LoadResult GetConsultoriosPorServicio(DataSourceLoadOptions loadOptions, long servicioId, long sedesId)
        {
            return DataSourceLoader.Load(Manager().ProgramacionCitasBusinessLogic().GetConsultoriosPorServicio(servicioId, sedesId), loadOptions);
        }
        [HttpPost]
        public LoadResult GetEmpleadosPorServicio(DataSourceLoadOptions loadOptions, long servicioId)
        {
            return DataSourceLoader.Load(Manager().ProgramacionCitasBusinessLogic().GetEmpleadosPorServicio(servicioId), loadOptions);
        }
        [HttpPost]
        public LoadResult GetEmpleadosProfesionales(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(Manager().GetBusinessLogic<Empleados>().Tabla(true).Where(x => x.TipoEmpleados == 2), loadOptions);
        }
        #endregion

        [HttpGet]
        public IActionResult VerificarAgendaDisponiblePorServicio(long servicioId)
        {
            bool result = Manager().ProgramacionCitasBusinessLogic().VerificarAgendaDisponiblePorServicio(servicioId);
            return new OkObjectResult(result);
        }

        [HttpGet]
        public IActionResult ObtenerSchedulerVerAgenda(long servicioId, long consultorioId, long? empleadoId, long estadosIdTipoDuracion, long duracion, DateTime? fechaScheduler)
        {
            SchedulerModel schedulerModel = Manager().ProgramacionCitasBusinessLogic().ObtenerSchedulerAgendaDisponible(servicioId, consultorioId, empleadoId, estadosIdTipoDuracion, duracion, fechaScheduler);
            return PartialView("SchedulerVerAgenda", schedulerModel);
        }

        [HttpGet]
        public IActionResult ConsultarDisponibilidad(long servicioId, long consultorioId, long? empleadoId, DateTime fechaInicio, long duracion, long tipoDuracion)
        {
            var data = Manager().ProgramacionCitasBusinessLogic().ConsultarDisponibilidad(servicioId, consultorioId, empleadoId, fechaInicio, duracion, tipoDuracion);
            return new OkObjectResult(data);
        }
        [HttpPost]
        public LoadResult GetCitasPorPaciente(DataSourceLoadOptions loadOptions, long pacientesId, long citaId)
        {
            DateTime diaActual = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0);
            return DataSourceLoader.Load(Manager().GetBusinessLogic<ProgramacionCitas>().Tabla(true).Where(x => x.PacientesId == pacientesId && x.FechaInicio >= diaActual && x.Id != citaId && x.EstadosId != 6), loadOptions);
        }

        [HttpGet]
        public IActionResult CancelarCita(long Id, string motivoCancelacion)
        {
            try
            {
                if (Id > 0)
                {
                    var cita = Manager().GetBusinessLogic<ProgramacionCitas>().FindById(x => x.Id == Id, false);
                    cita.EstadosId = 8;
                    cita.MotivoCancelacion = motivoCancelacion;
                    cita.LastUpdate = DateTime.Now;
                    cita.UpdatedBy = User.Identity.Name;
                    Manager().GetBusinessLogic<ProgramacionCitas>().Modify(cita);
                    Manager().ProgramacionCitasBusinessLogic().EnviarCorreoCancelacionCita(Id, DApp.GetFullDomain(HttpContext));
                    return Edit(Id);
                }
                else
                {
                    throw new Exception("El id de la cita es erroneo.");
                }
            }
            catch (Exception e)
            {
                return new BadRequestObjectResult(e.GetFrontFullErrorMessage());
            }
        }

        [HttpGet]
        public IActionResult ObtenerValorTarifaConvenio(long convenioId, long servicioId)
        {
            try
            {
                if (convenioId > 0 && servicioId > 0)
                {
                    decimal tarifaConvenio = Manager().ProgramacionCitasBusinessLogic().ObtenerValorTarifaConvenio(convenioId, servicioId);
                    return new OkObjectResult(tarifaConvenio);
                }

                return new OkObjectResult(null);
            }
            catch (Exception e)
            {
                return new BadRequestObjectResult(e.GetFrontFullErrorMessage());
            }
        }

        [HttpGet]
        public IActionResult ConsultarDisponibilidadCitaAdicional(DateTime fechaInicio, long consultorioId)
        {
            var data = Manager().ProgramacionCitasBusinessLogic().ConsultarDisponibilidadCitaAdicional(fechaInicio, consultorioId);
            return new OkObjectResult(data);
        }

        [HttpGet]
        public IActionResult DescargarXLSX0256(long sedeId, DateTime periodo)
        {
            try
            {
                if (sedeId <= 0)
                    throw new Exception("Los parametros no fueron enviados correctamente al servidor.");

                if (periodo < DateTime.MinValue)
                    throw new Exception($"El per�odo fue enviado incorrectamente. {periodo.ToShortDateString()}");

                var fechaDesde = new DateTime(periodo.Year, periodo.Month, periodo.Day, 0, 0, 0);
                var fechaHasta = new DateTime(periodo.Year, periodo.Month, DateTime.DaysInMonth(periodo.Year, periodo.Month), 23, 59, 59);
                byte[] book = Manager().ProgramacionCitasBusinessLogic().DescargarXLSX0256(sedeId, fechaDesde, fechaHasta);
                return File(book, "application/octet-stream", $"R-0256_{sedeId}_{fechaDesde.ToString("yyyyMM")}.xlsx");
            }
            catch (Exception e)
            {
                return new BadRequestObjectResult(e.GetFrontFullErrorMessage());
            }
        }

        [HttpGet]
        public IActionResult EnviarCorreoCitaProgramada(long citaId)
        {
            try
            {
                if (citaId <= 0)
                    throw new Exception("Error enviando cita al servidor.");
                Manager().ProgramacionCitasBusinessLogic().EnviarCorreoCitaProgramada(citaId, DApp.GetFullDomain(HttpContext));
                return Ok();
            }
            catch (Exception e)
            {
                return new BadRequestObjectResult(e.GetFrontFullErrorMessage());
            }
        }

        [HttpGet]
        public IActionResult VerDisponibilidadProfesional(long profesionalId)
        {
            try
            {
                if (profesionalId <= 0)
                    throw new Exception("Error enviando profesional al servidor.");
                SchedulerModel schedulerModel = Manager().ProgramacionCitasBusinessLogic().VerDisponibilidadProfesional(profesionalId);
                return PartialView("SchedulerVerAgenda", schedulerModel);
            }
            catch (Exception e)
            {
                return new BadRequestObjectResult(e.GetFrontFullErrorMessage());
            }
        }
    }
}
