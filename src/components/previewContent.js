const defaultImg =
  'https://img.alicdn.com/tfs/TB14tSiKhTpK1RjSZFKXXa2wXXa-354-330.png'

export default {
  functional: true,
  render(h, ctx) {
    const { format, value } = ctx.props
    return format === 'image' ? (
      <img
        src={value || defaultImg}
        alt="图片地址错误"
        class="fr-preview-image"
      />
    ) : null
  },
}
