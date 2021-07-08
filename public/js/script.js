function confirmDeletion(event, form) {
  event.preventDefault()
  let decision = confirm('Deletar?')
  if (decision) {
    form.submit()
  }
}
