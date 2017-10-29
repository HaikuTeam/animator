function getArchyFormatNodesFromRows (label, rows) {
  return {
    label,
    nodes: rows.filter((row) => !row.representsStringNode()).map((row) => {
      return getArchyFormatNodesFromRows('', row.children)
    })
  }
}

module.exports = getArchyFormatNodesFromRows
