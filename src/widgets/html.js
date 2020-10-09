export default {
  functional: true,
  render(h, ctx) {
    const { value, schema } = ctx.props
    let __html = ''
    try {
      __html = value ? value : schema.default
      if (typeof __html !== 'string') {
        __html = ''
      }
    } catch (error) {
      // throw error
    }
    return <div domPropsInnerHTML={__html} />
  },
}
