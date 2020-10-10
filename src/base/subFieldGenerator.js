const subFieldGenerator = ({
  fieldCanRedefine: can,
  Field: SourceField = null,
  props = {},
}) => args => ({
  functional: true,
  render() {
    const { name, Field: RedefineField = null, ...others } = args
    const Field = (can && RedefineField) || SourceField
    if (Field) {
      const fieldProps = {
        ...props,
        name,
        ...others,
      }
      return <Field {...{ props: fieldProps }} key={name} />
    }
    return null
  },
})

export default subFieldGenerator
