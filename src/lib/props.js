export default {
  totalCount: {
    type: Number,
    required: true
  },
  change: {
    type: Function,
    default: () => {}
  }
}
