import { DatePicker } from 'ant-design-vue'
import moment from 'moment'
import { getFormat } from '../base/utils'

export default {
  functional: true,
  render(h, ctx) {
    const p = ctx.props
    const onChange = (value, string) => ctx.listeners.change(p.name, string)
    const { format = 'dateTime' } = p.schema
    const dateFormat = getFormat(format)
    const [start, end] = Array.isArray(p.value) ? p.value : []
    const value =
      start && end ? [moment(start, dateFormat), moment(end, dateFormat)] : []

    const dateParams = {
      ...p.options,
      value,
      style: { width: '100%' },
      showTime: format === 'dateTime',
      disabled: p.disabled || p.readonly,
    }
    return (
      <DatePicker.RangePicker {...{ props: dateParams }} onChange={onChange} />
    )
  },
}
