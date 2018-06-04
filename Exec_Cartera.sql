DELETE FROM tmp_cartera_asegurado

DECLARE @RC int
DECLARE @tipo_pers int
DECLARE @pers int
DECLARE @cod_suc numeric(3,0)
DECLARE @cod_ramo numeric(3,0)
DECLARE @cod_moneda numeric(2,0)
DECLARE @tipo_fechas int
DECLARE @fec_desde varchar(8)
DECLARE @fec_hasta varchar(8)
DECLARE @tipo_agente int
DECLARE @nro_endoso int
DECLARE @tipo_busqueda int

-- TODO: Establezca los valores de los par�metros aqu�.

EXECUTE @RC = [dbo].[usp_cartera_asegurado] 
   @tipo_pers
  ,@pers
  ,@cod_suc
  ,@cod_ramo
  ,@cod_moneda
  ,@tipo_fechas
  ,@fec_desde
  ,@fec_hasta
  ,@tipo_agente
  ,@nro_endoso
  ,@tipo_busqueda
GO