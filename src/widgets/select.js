import { Select } from 'ant-design-vue'
export default {
  functional: true,
  render(h, ctx) {
    const p = ctx.props
    const { change } = ctx.listeners
    const onChange = value => change(p.name, value)
    const style = p.invalid
      ? { borderColor: '#ff4d4f', boxShadow: '0 0 0 2px rgba(255,77,79,.2)' }
      : {}
    const { enum: enums, enumNames } = p.schema || {}
    return (
      <Select
        style={{ width: '100%', ...style }}
        {...{ props: p.options }}
        disabled={p.disabled || p.readonly}
        value={p.value}
        onChange={onChange}
      >
        {(enums || []).map((val, index) => {
          let option = enumNames ? enumNames[index] : val
          const isHtml = typeof option === 'string' && option[0] === '<'
          if (isHtml) {
            option = <span domPropsInnerHTML={option} />
          }
          return (
            <Select.Option value={val} key={index}>
              {option}
            </Select.Option>
          )
        })}
      </Select>
    )
  },
}
