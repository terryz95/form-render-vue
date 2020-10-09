import { DatePicker, TimePicker } from 'ant-design-vue'
import DateHoc from '../components/dateHoc'

export default {
  functional: true,
  render(h, ctx) {
    const p = ctx.props
    const { format = 'dateTime' } = p.schema
    const onChange = (value, string) => ctx.listeners.change(p.name, string)
    const dateComponent = format === 'time' ? TimePicker : DatePicker
    return <DateHoc p={p} dateComponent={dateComponent} onChange={onChange} />
  },
}
