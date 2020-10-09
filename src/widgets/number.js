import { InputNumber } from 'ant-design-vue'
export default {
  functional: true,
  render(h, ctx) {
    const p = ctx.props
    const style = p.invalid
      ? { borderColor: '#ff4d4f', boxShadow: '0 0 0 2px rgba(255,77,79,.2)' }
      : {}
    const { max, min, step } = p.schema
    let obj = {}
    if (max || max === 0) {
      obj = { max }
    }

    if (min || min === 0) {
      obj = { ...obj, min }
    }

    if (step) {
      obj = { ...obj, step }
    }

    const onChange = value => {
      p.onChange(p.name, value)
    }

    return (
      <InputNumber
        style={{ width: '100%', ...style }}
        disabled={p.disabled || p.readonly}
        {...{ props: { ...obj, ...p.options } }}
        value={p.value}
        onChange={onChange}
      />
    )
  },
}
