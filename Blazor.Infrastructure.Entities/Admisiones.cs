using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq.Expressions;
using Serialize.Linq.Extensions;
using Dominus.Backend.Data;
using Dominus.Backend.DataBase;

namespace Blazor.Infrastructure.Entities
{
    /// <summary>
    /// Admisiones object for mapped table Admisiones.
    /// </summary>
    [Table("Admisiones")]
    public partial class Admisiones : BaseEntity
    {

       #region Columnas normales)

       [Column("NroAutorizacion")]
       [DDisplayName("Admisiones.NroAutorizacion")]
       [DStringLength("Admisiones.NroAutorizacion",50)]
       public virtual String NroAutorizacion { get; set; }

       [Column("FechaAutorizacion", TypeName = "datetime")]
       [DDisplayName("Admisiones.FechaAutorizacion")]
       public virtual DateTime? FechaAutorizacion { get; set; }

       [Column("PorcDescAutorizado")]
       [DDisplayName("Admisiones.PorcDescAutorizado")]
       [DRequired("Admisiones.PorcDescAutorizado")]
       public virtual Decimal PorcDescAutorizado { get; set; }

       [Column("FechaAprobacion", TypeName = "datetime")]
       [DDisplayName("Admisiones.FechaAprobacion")]
       public virtual DateTime? FechaAprobacion { get; set; }

       [Column("ValorCopago")]
       [DDisplayName("Admisiones.ValorCopago")]
       [DRequired("Admisiones.ValorCopago")]
       public virtual Decimal ValorCopago { get; set; }

       [Column("Facturado")]
       [DDisplayName("Admisiones.Facturado")]
       [DRequired("Admisiones.Facturado")]
       public virtual Boolean Facturado { get; set; }

       [Column("ValorPagarParticular")]
       [DDisplayName("Admisiones.ValorPagarParticular")]
       [DRequired("Admisiones.ValorPagarParticular")]
       public virtual Decimal ValorPagarParticular { get; set; }

       [Column("ObservacionFactura")]
       [DDisplayName("Admisiones.ObservacionFactura")]
       [DStringLength("Admisiones.ObservacionFactura",2000)]
       public virtual String ObservacionFactura { get; set; }

       [Column("NumeroPrescripcion")]
       [DDisplayName("Admisiones.NumeroPrescripcion")]
       [DStringLength("Admisiones.NumeroPrescripcion",30)]
       public virtual String NumeroPrescripcion { get; set; }

       [Column("NumeroSuministroPrescripcion")]
       [DDisplayName("Admisiones.NumeroSuministroPrescripcion")]
       [DStringLength("Admisiones.NumeroSuministroPrescripcion",30)]
       public virtual String NumeroSuministroPrescripcion { get; set; }

       [Column("NumeroPoliza")]
       [DDisplayName("Admisiones.NumeroPoliza")]
       [DStringLength("Admisiones.NumeroPoliza",30)]
       public virtual String NumeroPoliza { get; set; }

       [Column("EsControl")]
       [DDisplayName("Admisiones.EsControl")]
       [DRequired("Admisiones.EsControl")]
       public virtual Boolean EsControl { get; set; }

       [Column("DetalleAnulacion")]
       [DDisplayName("Admisiones.DetalleAnulacion")]
       [DStringLength("Admisiones.DetalleAnulacion",1000)]
       public virtual String DetalleAnulacion { get; set; }

       [Column("Responsable")]
       [DDisplayName("Admisiones.Responsable")]
       [DStringLength("Admisiones.Responsable",255)]
       public virtual String Responsable { get; set; }

       [Column("TelefonoResponsable")]
       [DDisplayName("Admisiones.TelefonoResponsable")]
       [DStringLength("Admisiones.TelefonoResponsable",100)]
       public virtual String TelefonoResponsable { get; set; }

       [Column("Acompanante")]
       [DDisplayName("Admisiones.Acompanante")]
       [DStringLength("Admisiones.Acompanante",255)]
       public virtual String Acompanante { get; set; }

       [Column("TelefonoAcompanante")]
       [DDisplayName("Admisiones.TelefonoAcompanante")]
       [DStringLength("Admisiones.TelefonoAcompanante",100)]
       public virtual String TelefonoAcompanante { get; set; }

       [Column("Consecutivo")]
       [DDisplayName("Admisiones.Consecutivo")]
       [DRequired("Admisiones.Consecutivo")]
       public virtual Int64 Consecutivo { get; set; }

       #endregion

       #region Columnas referenciales)

       [Column("PacientesId")]
       [DDisplayName("Admisiones.PacientesId")]
       [DRequired("Admisiones.PacientesId")]
       [DRequiredFK("Admisiones.PacientesId")]
       public virtual Int64 PacientesId { get; set; }

       [Column("ConveniosId")]
       [DDisplayName("Admisiones.ConveniosId")]
       public virtual Int64? ConveniosId { get; set; }

       [Column("DiagnosticosId")]
       [DDisplayName("Admisiones.DiagnosticosId")]
       [DRequired("Admisiones.DiagnosticosId")]
       [DRequiredFK("Admisiones.DiagnosticosId")]
       public virtual Int64 DiagnosticosId { get; set; }

       [Column("ValorPagoEstadosId")]
       [DDisplayName("Admisiones.ValorPagoEstadosId")]
       [DRequired("Admisiones.ValorPagoEstadosId")]
       [DRequiredFK("Admisiones.ValorPagoEstadosId")]
       public virtual Int64 ValorPagoEstadosId { get; set; }

       [Column("UserAproboId")]
       [DDisplayName("Admisiones.UserAproboId")]
       public virtual Int64? UserAproboId { get; set; }

       [Column("FilialesId")]
       [DDisplayName("Admisiones.FilialesId")]
       public virtual Int64? FilialesId { get; set; }

       [Column("ExoneracionArchivoId")]
       [DDisplayName("Admisiones.ExoneracionArchivoId")]
       public virtual Int64? ExoneracionArchivoId { get; set; }

       [Column("EmpresasId")]
       [DDisplayName("Admisiones.EmpresasId")]
       [DRequired("Admisiones.EmpresasId")]
       [DRequiredFK("Admisiones.EmpresasId")]
       public virtual Int64 EmpresasId { get; set; }

       [Column("EstadosId")]
       [DDisplayName("Admisiones.EstadosId")]
       [DRequired("Admisiones.EstadosId")]
       [DRequiredFK("Admisiones.EstadosId")]
       public virtual Int64 EstadosId { get; set; }

       [Column("ProgramacionCitasId")]
       [DDisplayName("Admisiones.ProgramacionCitasId")]
       [DRequired("Admisiones.ProgramacionCitasId")]
       [DRequiredFK("Admisiones.ProgramacionCitasId")]
       public virtual Int64 ProgramacionCitasId { get; set; }

       [Column("FormasPagosId")]
       [DDisplayName("Admisiones.FormasPagosId")]
       public virtual Int64? FormasPagosId { get; set; }

       [Column("FacturaCopagoCuotaModeradoraId")]
       [DDisplayName("Admisiones.FacturaCopagoCuotaModeradoraId")]
       public virtual Int64? FacturaCopagoCuotaModeradoraId { get; set; }

       [Column("MedioPagosId")]
       [DDisplayName("Admisiones.MedioPagosId")]
       public virtual Int64? MedioPagosId { get; set; }

       [Column("DocumentosId")]
       [DDisplayName("Admisiones.DocumentosId")]
       public virtual Int64? DocumentosId { get; set; }

       [Column("TiposUsuariosId")]
       [DDisplayName("Admisiones.TiposUsuariosId")]
       [DRequired("Admisiones.TiposUsuariosId")]
       [DRequiredFK("Admisiones.TiposUsuariosId")]
       public virtual Int64 TiposUsuariosId { get; set; }

       [Column("CoberturaPlanBeneficiosId")]
       [DDisplayName("Admisiones.CoberturaPlanBeneficiosId")]
       [DRequired("Admisiones.CoberturaPlanBeneficiosId")]
       [DRequiredFK("Admisiones.CoberturaPlanBeneficiosId")]
       public virtual Int64 CoberturaPlanBeneficiosId { get; set; }

       [Column("ParentescosId")]
       [DDisplayName("Admisiones.ParentescosId")]
       public virtual Int64? ParentescosId { get; set; }

       [Column("OcupacionesId")]
       [DDisplayName("Admisiones.OcupacionesId")]
       public virtual Int64? OcupacionesId { get; set; }

       [Column("ModalidadAtencionId")]
       [DDisplayName("Admisiones.ModalidadAtencionId")]
       [DRequired("Admisiones.ModalidadAtencionId")]
       [DRequiredFK("Admisiones.ModalidadAtencionId")]
       public virtual Int64 ModalidadAtencionId { get; set; }

       [Column("ViaIngresoServicioSaludId")]
       [DDisplayName("Admisiones.ViaIngresoServicioSaludId")]
       public virtual Int64? ViaIngresoServicioSaludId { get; set; }

       #endregion

       #region Propiedades referencias de entrada)

       [ForeignKey("OcupacionesId")]
       public virtual Ocupaciones Ocupaciones { get; set; }

       [ForeignKey("ViaIngresoServicioSaludId")]
       public virtual ViaIngresoServicioSalud ViaIngresoServicioSalud { get; set; }

       [ForeignKey("ExoneracionArchivoId")]
       public virtual Archivos ExoneracionArchivo { get; set; }

       [ForeignKey("CoberturaPlanBeneficiosId")]
       public virtual CoberturaPlanBeneficios CoberturaPlanBeneficios { get; set; }

       [ForeignKey("ConveniosId")]
       public virtual Convenios Convenios { get; set; }

       [ForeignKey("DiagnosticosId")]
       public virtual Diagnosticos Diagnosticos { get; set; }

       [ForeignKey("DocumentosId")]
       public virtual Documentos Documentos { get; set; }

       [ForeignKey("EmpresasId")]
       public virtual Empresas Empresas { get; set; }

       [ForeignKey("ValorPagoEstadosId")]
       public virtual Estados ValorPagoEstados { get; set; }

       [ForeignKey("EstadosId")]
       public virtual Estados Estados { get; set; }

       [ForeignKey("FacturaCopagoCuotaModeradoraId")]
       public virtual Facturas FacturaCopagoCuotaModeradora { get; set; }

       [ForeignKey("FilialesId")]
       public virtual Filiales Filiales { get; set; }

       [ForeignKey("FormasPagosId")]
       public virtual FormasPagos FormasPagos { get; set; }

       [ForeignKey("MedioPagosId")]
       public virtual MediosPago MedioPagos { get; set; }

       [ForeignKey("ModalidadAtencionId")]
       public virtual ModalidadAtencion ModalidadAtencion { get; set; }

       [ForeignKey("PacientesId")]
       public virtual Pacientes Pacientes { get; set; }

       [ForeignKey("ParentescosId")]
       public virtual Parentescos Parentescos { get; set; }

       [ForeignKey("ProgramacionCitasId")]
       public virtual ProgramacionCitas ProgramacionCitas { get; set; }

       [ForeignKey("TiposUsuariosId")]
       public virtual TiposUsuarios TiposUsuarios { get; set; }

       [ForeignKey("UserAproboId")]
       public virtual User UserAprobo { get; set; }

       #endregion

       #region Reglas expression

       public override Expression<Func<T, bool>> PrimaryKeyExpression<T>()
       {
       Expression<Func<Admisiones, bool>> expression = entity => entity.Id == this.Id;
       return expression as Expression<Func<T, bool>>;
       }

       public override List<ExpRecurso> GetAdicionarExpression<T>()
       {
        var rules = new List<ExpRecurso>();
        Expression<Func<Admisiones, bool>> expression = null;

        expression = entity => entity.Consecutivo == this.Consecutivo;
        rules.Add(new ExpRecurso(expression.ToExpressionNode() , new Recurso("BLL.BUSINESS.UNIQUE", "Admisiones.Consecutivo" )));

       return rules;
       }

       public override List<ExpRecurso> GetModificarExpression<T>()
       {
        var rules = new List<ExpRecurso>();
        Expression<Func<Admisiones, bool>> expression = null;

        expression = entity => !(entity.Id == this.Id && entity.Consecutivo == this.Consecutivo)
                               && entity.Consecutivo == this.Consecutivo;
        rules.Add(new ExpRecurso(expression.ToExpressionNode() , new Recurso("BLL.BUSINESS.UNIQUE", "Admisiones.Consecutivo" )));

       return rules;
       }

       public override List<ExpRecurso> GetEliminarExpression<T>()
       {
        var rules = new List<ExpRecurso>();
        Expression<Func<AdmisionesServiciosPrestados, bool>> expression0 = entity => entity.AdmisionesId == this.Id;
        rules.Add(new ExpRecurso(expression0.ToExpressionNode() , new Recurso("BLL.BUSINESS.DELETE_REL","AdmisionesServiciosPrestados"), typeof(AdmisionesServiciosPrestados)));

        Expression<Func<Atenciones, bool>> expression1 = entity => entity.AdmisionesId == this.Id;
        rules.Add(new ExpRecurso(expression1.ToExpressionNode() , new Recurso("BLL.BUSINESS.DELETE_REL","Atenciones"), typeof(Atenciones)));

        Expression<Func<Facturas, bool>> expression2 = entity => entity.AdmisionesId == this.Id;
        rules.Add(new ExpRecurso(expression2.ToExpressionNode() , new Recurso("BLL.BUSINESS.DELETE_REL","Facturas"), typeof(Facturas)));

       return rules;
       }

       #endregion
    }
 }
