export function counter() {
  if (!counter.count) counter.count = 0
  counter.count++
}

export function say(str) {
  console.log('say:', str)
}
