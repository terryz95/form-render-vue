import { Popover, Icon } from 'ant-design-vue'
import PreviewContent from './previewContent'

export default {
  functional: true,
  render(h, ctx) {
    const { format, value } = ctx.props
    if (format !== 'image') {
      return null
    }
    return (
      <Popover
        class="fr-preview"
        arrowPointAtCenter={true}
        placement="bottom"
        scopedSlots={{
          content: () => <PreviewContent format={format} value={value} />,
        }}
      >
        <Icon type="picture" />
      </Popover>
    )
  },
}
