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
    /// TiposUsuarios object for mapped table TiposUsuarios.
    /// </summary>
    [Table("TiposUsuarios")]
    public partial class TiposUsuarios : BaseEntity
    {

       #region Columnas normales)

       [Column("Descripcion")]
       [DDisplayName("TiposUsuarios.Descripcion")]
       [DRequired("TiposUsuarios.Descripcion")]
       [DStringLength("TiposUsuarios.Descripcion",1024)]
       public virtual String Descripcion { get; set; }

       [Column("Codigo")]
       [DDisplayName("TiposUsuarios.Codigo")]
       [DStringLength("TiposUsuarios.Codigo",5)]
       public virtual String Codigo { get; set; }

       [Column("CodigoRips")]
       [DDisplayName("TiposUsuarios.CodigoRips")]
       [DStringLength("TiposUsuarios.CodigoRips",5)]
       public virtual String CodigoRips { get; set; }

       #endregion

       #region Reglas expression

       public override Expression<Func<T, bool>> PrimaryKeyExpression<T>()
       {
       Expression<Func<TiposUsuarios, bool>> expression = entity => entity.Id == this.Id;
       return expression as Expression<Func<T, bool>>;
       }

       public override List<ExpRecurso> GetAdicionarExpression<T>()
       {
        var rules = new List<ExpRecurso>();
        Expression<Func<TiposUsuarios, bool>> expression = null;

       return rules;
       }

       public override List<ExpRecurso> GetModificarExpression<T>()
       {
        var rules = new List<ExpRecurso>();
        Expression<Func<TiposUsuarios, bool>> expression = null;

       return rules;
       }

       public override List<ExpRecurso> GetEliminarExpression<T>()
       {
        var rules = new List<ExpRecurso>();
        Expression<Func<Admisiones, bool>> expression0 = entity => entity.TiposUsuariosId == this.Id;
        rules.Add(new ExpRecurso(expression0.ToExpressionNode() , new Recurso("BLL.BUSINESS.DELETE_REL","Admisiones"), typeof(Admisiones)));

       return rules;
       }

       #endregion
    }
 }
