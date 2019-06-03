function counter() {
  if (!counter.count) counter.count = 0
  counter.count++
}

counter()
counter()

console.log(counter.count)
