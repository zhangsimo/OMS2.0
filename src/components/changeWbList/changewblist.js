
//维保配件数据转自己用的数据

export function conversionList(val){
  if(val.length < 1){
    return
  }else {
    let arr = []
    val.forEach( data => {
      arr.push({
        partId: data.id || '',
        partInnerId: data.code || '',
        partCode : data.partCode || '',
        partName : data.partStandardName || '',
        fullName : data.fullName || '',
        oemCode : data.oeCode || '',
        partBrand : data.partBrand || '',
        carBrandName : data.adapterCarBrand || '',
        carModelName : data.adapterCarModel|| '',
        spec : data.specifications || '',
        unit : data.minUnit || '',
        carTypef : data.baseType ? data.baseType.firstType ? data.baseType.firstType.typeName ? data.baseType.firstType.typeName : '' : '' :'',
        carTypes : data.baseType ? data.baseType.secondType ?data.baseType.secondType.typeName ? data.baseType.secondType.typeName : '':'':'',
        carTypet : data.baseType ? data.baseType.thirdType ?data.baseType.thirdType.typeName ? data.baseType.thirdType.typeName : '' :'':''
      })
    })
    return arr

  }
}
