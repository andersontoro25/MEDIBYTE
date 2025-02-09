﻿using Blazor.BusinessLogic.Models.Enums;
using Blazor.Infrastructure;
using Blazor.Infrastructure.Entities;
using Blazor.Infrastructure.Entities.Custom;
using Dominus.Backend.Application;
using Dominus.Backend.Data;
using Dominus.Backend.DataBase;
using System;
using System.Linq;

namespace Blazor.BusinessLogic
{
    public class GenericBusinessLogic<T> : IDomainLogic<T> where T : BaseEntity
    {
        public GenericBusinessLogic(IUnitOfWork unitWork)
        {
            UnitOfWork = unitWork;
            CommitTheTransaction = false;
            BusinessLogic = new Dominus.Backend.DataBase.BusinessLogic(UnitOfWork.Settings);
        }

        public GenericBusinessLogic(DataBaseSetting configuracionBD)
        {
            UnitOfWork = new BlazorUnitWork(configuracionBD);
            CommitTheTransaction = true;
            BusinessLogic = new Dominus.Backend.DataBase.BusinessLogic(UnitOfWork.Settings);
        }

        public int GetSecuence(string prefix)
        {
            var secuence = UnitOfWork.Repository<Secuences>().FindById(x => x.Id == prefix, false);
            if (secuence == null)
            {
                secuence = new Secuences { Id = prefix, Secuence = 1 };
                secuence = UnitOfWork.Repository<Secuences>().Add(secuence);
            }
            else
            {
                secuence.Secuence++;
                secuence = UnitOfWork.Repository<Secuences>().Modify(secuence);
            }
            return secuence.Secuence;
        }

        public string GetConsecutivoParaEnvioFE()
        {
            var empresa = UnitOfWork.Repository<Empresas>().FindById(x => true, false);
            if (empresa == null)
            {
                throw new Exception("Error al encontrar los consecutivos para envio FE.");
            }

            var consecutivo = string.Empty;
            consecutivo += empresa.NumeroIdentificacion.PadLeft(10, '0');
            consecutivo += empresa.CodigoPT;
            consecutivo += DateTime.Now.ToString("yy");
            var deciConsec = empresa.ConsecutivoEnvioFE + 1;
            if (DateTime.Now.Year != empresa.AnioEnvioFE)
            {
                empresa.AnioEnvioFE = DateTime.Now.Year;
                empresa.ConsecutivoEnvioFE = 1;
                deciConsec = 1;
            }
            consecutivo += deciConsec.ToString("X").PadLeft(8, '0');
            empresa.ConsecutivoEnvioFE = deciConsec;
            empresa = UnitOfWork.Repository<Empresas>().Modify(empresa);

            return consecutivo;
        }

        #region Manejo de Imagenes a Tabla Archivos

        public long? ManageArchivo(Archivos archivo, long? idArchivoMaestro, GenericBusinessLogic<Archivos> archivoLogica)
        {
            if (archivo == null)
                return null;
            else if (string.IsNullOrWhiteSpace(archivo.Nombre) || string.IsNullOrWhiteSpace(archivo.TipoContenido) || string.IsNullOrWhiteSpace(archivo.Maestro))
                return null;

            var archivoBD = archivoLogica.FindById(x => x.Id == idArchivoMaestro, false);

            if (archivo.EliminarArchivo && idArchivoMaestro != null && idArchivoMaestro > 0)
            {
                archivoBD.Nombre = "delete";
                archivoBD.TipoContenido = "delete";
                archivoBD.Archivo = null;
                archivoBD.LastUpdate = DateTime.Now;
                archivoBD.UpdatedBy = archivo.UpdatedBy;
                archivoLogica.Modify(archivoBD);
                return null;
            }

            if (archivo.IsNew)
            {
                archivo.Archivo = DApp.Util.StringToArrayBytes(archivo.StringToBase64);
                archivo.LastUpdate = DateTime.Now;
                if (idArchivoMaestro == null || idArchivoMaestro == 0)
                {
                    archivo.CreationDate = DateTime.Now;
                    archivo = archivoLogica.Add(archivo);
                }
                else
                {
                    archivo.CreationDate = archivoBD.CreationDate;
                    archivo.CreatedBy = archivoBD.CreatedBy;
                    archivo.Id = idArchivoMaestro.GetValueOrDefault();
                    archivo = archivoLogica.Modify(archivo);
                }

                return archivo.Id;
            }
            else
            {
                return idArchivoMaestro;
            }
        }

        public void EliminarArchivoDeMaestro(long? idArchivoMaestro, BlazorUnitWork unitOfWork)
        {
            if (idArchivoMaestro != null && idArchivoMaestro > 0)
            {
                var archivoBD = unitOfWork.Repository<Archivos>().FindById(x => x.Id == idArchivoMaestro, false);
                unitOfWork.Repository<Archivos>().Remove(archivoBD);
            }
        }

        #endregion

    }
}
