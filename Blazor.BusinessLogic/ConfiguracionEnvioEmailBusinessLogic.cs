﻿using Blazor.Infrastructure.Entities;
using Dominus.Backend.Application;
using Dominus.Backend.DataBase;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Mail;
using System.Net.Mime;

namespace Blazor.BusinessLogic
{
    public class ConfiguracionEnvioEmailBusinessLogic : GenericBusinessLogic<ConfiguracionEnvioEmail>
    {

        public ConfiguracionEnvioEmailBusinessLogic(IUnitOfWork unitWork) : base(unitWork)
        {
        }

        public ConfiguracionEnvioEmailBusinessLogic(DataBaseSetting configuracionBD) : base(configuracionBD)
        {
        }

        public void EnviarEmail(EmailModelConfig data)
        {
            ConfiguracionEnvioEmailLog configuracionEnvioEmailLog = new ConfiguracionEnvioEmailLog();

            if (!string.IsNullOrWhiteSpace(data.Origen))
                data.Server = this.FindById(x => x.Origen.Equals(data.Origen), false);
            else
                data.Origen = data.Server.Origen;

            configuracionEnvioEmailLog.Id = 0;
            configuracionEnvioEmailLog.IsNew = true;
            configuracionEnvioEmailLog.UpdatedBy = "admin";
            configuracionEnvioEmailLog.CreatedBy = "admin";
            configuracionEnvioEmailLog.CreationDate = DateTime.Now;
            configuracionEnvioEmailLog.LastUpdate = DateTime.Now;
            configuracionEnvioEmailLog.Origen = data.Origen;
            configuracionEnvioEmailLog.CorreoEnvia = data.Server.CorreoElectronico;
            configuracionEnvioEmailLog.Asunto = data.Asunto;
            configuracionEnvioEmailLog.MetodoUso = data.MetodoUso;

            List<string> errores = new List<string>();
            try
            {

                if (data.Server != null)
                {
                    if (string.IsNullOrWhiteSpace(data.Asunto))
                    {
                        throw new Exception($"El asunto para el envio de correos es obligatorio.");
                    }

                    if (string.IsNullOrWhiteSpace(data.MetodoUso))
                    {
                        throw new Exception($"El MetodoUso para el envio de correos es obligatorio.");
                    }

                    if (string.IsNullOrWhiteSpace(data.Template))
                    {
                        throw new Exception($"La plantilla para el envio de correos es obligatorio.");
                    }

                    if (data.Destinatarios == null || data.Destinatarios?.Count <= 0)
                    {
                        throw new Exception($"Debe haber al menos un destinatario.");
                    }

                    string pathTemplate = Path.Combine(Environment.CurrentDirectory, "wwwroot", "TemplatesEmails", $"{data.Template}.html");
                    if (!File.Exists(pathTemplate))
                    {
                        throw new Exception($"La plantilla {data.Template} no fue encontrado en el sistema.");
                    }

                    string body = string.Empty;
                    using (StreamReader reader = new StreamReader(pathTemplate))
                    {
                        body = reader.ReadToEnd();
                    }

                    foreach (var dato in data.Datos)
                    {
                        body = body.Replace("{{" + dato.Key + "}}", dato.Value);
                    }

                    using (MailMessage mailMessage = new MailMessage())
                    {
                        mailMessage.From = new MailAddress(data.Server.CorreoElectronico);
                        mailMessage.Body = body;
                        mailMessage.Subject = data.Asunto;
                        mailMessage.IsBodyHtml = true;

                        foreach (var correo in data.Destinatarios)
                        {
                            bool valid = true;
                            if (string.IsNullOrWhiteSpace(correo))
                            {
                                valid = false;
                                errores.Add("Un destinatario agregado es nulo o vacio.");
                            }
                            if (!DApp.Util.EsEmailValido(correo))
                            {
                                valid = false;
                                errores.Add($"El correo electronico ({correo}) del destinatario no es valido.");
                            }

                            if (valid)
                                mailMessage.To.Add(new MailAddress(correo));
                        }

                        if (data.DestinatariosCopia != null && data.DestinatariosCopia.Count > 0)
                        {
                            foreach (var correo in data.DestinatariosCopia)
                            {
                                bool valid = true;
                                if (string.IsNullOrWhiteSpace(correo))
                                {
                                    valid = false;
                                    errores.Add("Un destinatario copia agregado es nulo o vacio.");
                                }
                                if (!DApp.Util.EsEmailValido(correo))
                                {
                                    valid = false;
                                    errores.Add($"El correo electronico ({correo}) del destinatario copia no es valido.");
                                }

                                if (valid)
                                    mailMessage.CC.Add(correo);
                            }
                        }

                        if (data.DestinatariosCopiaOculta != null && data.DestinatariosCopiaOculta.Count > 0)
                        {
                            foreach (var correo in data.DestinatariosCopiaOculta)
                            {
                                bool valid = true;
                                if (string.IsNullOrWhiteSpace(correo))
                                {
                                    valid = false;
                                    errores.Add("Un destinatario copia oculta agregado es nulo o vacio.");
                                }
                                if (!DApp.Util.EsEmailValido(correo))
                                {
                                    valid = false;
                                    errores.Add($"El correo electronico ({correo}) del destinatario copia oculta no es valido.");
                                }

                                if (valid)
                                    mailMessage.Bcc.Add(correo);
                            }
                        }

                        if (data.Server.EnviaCopiaOculta)
                        {
                            bool valid = true;
                            if (!DApp.Util.EsEmailValido(data.Server.CorreoCopiaOculta))
                            {
                                errores.Add($"El correo electronico ({data.Server.CorreoCopiaOculta}) de la copia oculta configurada no es valido.");
                            }

                            if (valid)
                                mailMessage.Bcc.Add(data.Server.CorreoCopiaOculta);
                        }

                        if (data.ArchivosAdjuntos != null && data.ArchivosAdjuntos.Count > 0)
                        {
                            foreach (var archivo in data.ArchivosAdjuntos)
                            {
                                Attachment attachment = new Attachment(archivo.Value, archivo.Key, MediaTypeNames.Application.Octet);
                                if (attachment.ContentStream.Length <= 10000000) // 10 megabytes
                                    mailMessage.Attachments.Add(attachment);
                                else
                                    errores.Add($"El archivo adjunto {archivo.Key} tiene un peso superior a 10 Megas.");
                            }
                        }

                        configuracionEnvioEmailLog.CorreosDestinatarios = "Para: " + string.Join(", ", data.Destinatarios);
                        if (data.DestinatariosCopia != null && data.DestinatariosCopia.Count > 0)
                        {
                            configuracionEnvioEmailLog.CorreosDestinatarios += " | CC: " + string.Join(", ", data.DestinatariosCopia);
                        }
                        if (data.DestinatariosCopiaOculta != null && data.DestinatariosCopiaOculta.Count > 0)
                        {
                            configuracionEnvioEmailLog.CorreosDestinatarios += " | CCO: " + string.Join(", ", data.DestinatariosCopia);
                        }
                        if (data.Server.EnviaCopiaOculta)
                        {
                            configuracionEnvioEmailLog.CorreosDestinatarios += " | CCO Configurado: " + data.Server.CorreoCopiaOculta;
                        }

                        if (errores.Count > 0)
                            configuracionEnvioEmailLog.ErrorDeDatos = string.Join(" | ", errores);

                        if (mailMessage.To.Count <= 0)
                            throw new Exception($"No hubo destinatarios validos en los ingresados.");

                        SmtpClient smtp = new SmtpClient();
                        smtp.Host = data.Server.ServidorSMTP;
                        smtp.EnableSsl = data.Server.UsaSSL;
                        System.Net.NetworkCredential NetworkCred = new System.Net.NetworkCredential();
                        NetworkCred.UserName = data.Server.CorreoElectronico;
                        NetworkCred.Password = data.Server.Contrasena;
                        smtp.UseDefaultCredentials = true;
                        smtp.Credentials = NetworkCred;
                        smtp.Port = data.Server.Puerto;
                        smtp.Send(mailMessage);

                        configuracionEnvioEmailLog.Exitoso = true;
                        configuracionEnvioEmailLog.Error = null;
                        new GenericBusinessLogic<ConfiguracionEnvioEmailLog>(this.UnitOfWork.Settings).Add(configuracionEnvioEmailLog);
                    }
                }
            }
            catch (Exception ex)
            {
                DApp.LogException(ex);

                if (string.IsNullOrWhiteSpace(configuracionEnvioEmailLog.Origen))
                {
                    configuracionEnvioEmailLog.Origen = "-";
                }
                if (string.IsNullOrWhiteSpace(configuracionEnvioEmailLog.CorreoEnvia))
                {
                    configuracionEnvioEmailLog.CorreoEnvia = "-";
                }
                if (string.IsNullOrWhiteSpace(configuracionEnvioEmailLog.Asunto))
                {
                    configuracionEnvioEmailLog.Asunto = "-";
                }
                if (string.IsNullOrWhiteSpace(configuracionEnvioEmailLog.MetodoUso))
                {
                    configuracionEnvioEmailLog.MetodoUso = "-";
                }
                configuracionEnvioEmailLog.Exitoso = false;
                configuracionEnvioEmailLog.Error = ex.GetBackFullErrorMessage();
                new GenericBusinessLogic<ConfiguracionEnvioEmailLog>(this.UnitOfWork.Settings).Add(configuracionEnvioEmailLog);
            }

        }

        public void ProbarEnvioCorreo(ConfiguracionEnvioEmail data)
        {
            EmailModelConfig envioEmailConfig = new EmailModelConfig();
            envioEmailConfig.Server = data;
            envioEmailConfig.Asunto = "PRUEBA DE ENVIO DE CORREO PARA CONFIGURACION POR SOFTWARE DE CLOUDONESOFT";
            envioEmailConfig.MetodoUso = "Prueba Envio";
            envioEmailConfig.Template = "EmailPruebaEnvioCorreo";
            envioEmailConfig.Destinatarios.Add(data.CorreoElectronico);
            envioEmailConfig.Datos = new Dictionary<string, string>
                {
                    {"usuario",$"{data.CreatedBy}" }
                };
            MemoryStream file = new MemoryStream(File.ReadAllBytes(Path.Combine(Environment.CurrentDirectory, "wwwroot", "images", "logo_letras_azul-G.png")));
            envioEmailConfig.ArchivosAdjuntos.Add("Logo CloudOneSoft.png", file);
            EnviarEmail(envioEmailConfig);
        }
    }

    public class EmailModelConfig
    {
        public ConfiguracionEnvioEmail Server { get; set; }
        public string Origen { get; set; }
        public string MetodoUso { get; set; }
        public string Asunto { get; set; }
        public string Template { get; set; }
        public Dictionary<string, string> Datos { get; set; } = new Dictionary<string, string>();
        public List<string> Destinatarios { get; set; } = new List<string>();
        public List<string> DestinatariosCopia { get; set; } = new List<string>();
        public List<string> DestinatariosCopiaOculta { get; set; } = new List<string>();
        public Dictionary<string, Stream> ArchivosAdjuntos { get; set; } = new Dictionary<string, Stream>();
    }
}
