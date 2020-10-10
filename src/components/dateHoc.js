import moment from 'moment'
import { getFormat } from '../base/utils'
export default {
  functional: true,
  props: {
    p: Object,
    dateComponent: Object,
  },
  render(h, ctx) {
    const { p, dateComponent: DateComponent } = ctx.props
    const { change: onChange } = ctx.listeners
    const style = p.invalid
      ? { borderColor: '#ff4d4f', boxShadow: '0 0 0 2px rgba(255,77,79,.2)' }
      : {}
    let { format = 'dateTime' } = p.schema
    if (p.options.format) {
      format = p.options.format
    }
    const dateFormat = getFormat(format)
    let defaultObj = {}
    if (p.value) {
      defaultObj.value = moment(p.value, dateFormat)
    } else {
      defaultObj.value = ''
    }

    const placeholderObj = p.description ? { placeholder: p.description } : {}

    const dateParams = {
      ...placeholderObj,
      ...p.options,
      ...defaultObj,
      style: { width: '100%', ...style },
      disabled: p.disabled || p.readonly,
    }

    // TODO: format是在options里自定义的情况，是否要判断一下要不要showTime
    if (format === 'dateTime') {
      dateParams.showTime = true
    }

    return <DateComponent {...{ props: dateParams }} onChange={onChange} />
  },
}
