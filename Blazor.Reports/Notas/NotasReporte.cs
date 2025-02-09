using Blazor.BusinessLogic.Models;

namespace Blazor.Reports.Notas
{
    public partial class NotasReporte
    {
        private ReporteModel InformacionReporte { get; set; }
        public NotasReporte(ReporteModel _informacionReporte)
        { 
            this.InformacionReporte = _informacionReporte;
            InitializeComponent();
        }

        protected override void OnReportInitialize()
        {
            this.P_Ids.Value = InformacionReporte.Ids;
            this.logoEmpresa.ImageSource = InformacionReporte.LogoEmpresa;
            this.p_LinkValidacionDIAN.Value = InformacionReporte.ParametrosAdicionales["p_LinkValidacionDIAN"];
            this.P_Ids.Visible = false;
            base.OnReportInitialize();
        }

        protected override void OnDataSourceDemanded(EventArgs e)
        {
            this.FuenteDatos.ConnectionParameters = InformacionReporte.DataConnectionParametersBase;
        }
    }
}