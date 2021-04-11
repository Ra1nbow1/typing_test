const getEl = el => document.getElementById(el)
const setStyle = (el, prop, val) => el.style[prop] = val
const setAttr = (el, attr, val) => el.setAttribute(attr, val)
const hasClass = (el, className) => el.classList.contains(className)
const addClass = (el, className) => {
  if(!hasClass(el, className))
    el.classList.add(className)
}
const removeClass = (el, className) => {
  if(hasClass(el, className))
    el.classList.remove(className)
}
const resetStyles = el => el.removeAttribute('style')
const removeChild = (el, child) => {
  if(child.parentNode === el) el.removeChild(child)
}
const removeAllChildren = el => {
  while (el.hasChildNodes()) el.removeChild(el.lastChild)
}

const getElPos = el => {
  const offset = el.getBoundingClientRect()
  return {
    left: offset.left,
    top: offset.top
  }
}

const setElPos = (el, x, y) => {
  setStyle(el, 'left', x + 'px')
  setStyle(el, 'top', y + 'px')
}

const getRand = (min, max) => Math.floor(Math.random() * max) + min

const getRandExcept = (min, max, exception) => {
  const rand = getRand(min, max)
  return rand === exception ? getRandExcept(min, max, exception) : rand
}

const getRandPosOffScreen = overrideQuadrant => {
  const lowX1 = 0 - (window.innerWidth * 0.2),
        highX1 = 0 - (window.innerWidth * 0.1),
        lowY1 = 0,
        highY1 = window.innerHeight,
        
        lowX2 = window.innerWidth * 1.1,
        highX2 = window.innerWidth * 1.2,
        lowY2 = 0,
        highY2 = window.innerHeight,
        
        lowX3 = 0,
        highX3 = window.innerWidth,
        lowY3 = 0 - (window.innerHeight * 0.2),
        highY3 = 0 - (window.innerHeight * 0.1),
        
        lowX4 = 0,
        highX4 = window.innerWidth,
        lowY4 = window.innerHeight * 1.1,
        highY4 = window.innerHeight * 1.2
  
  let rand = Math.floor((Math.random() * 4) + 1)
  
  if(overrideQuadrant){
    rand = overrideQuadrant
  }
  
  let x = 0,
      y = 0
  
  switch(rand){
    case 1:
      x = Math.floor(Math.random() * (highX1 - lowX1 + 1)) + lowX1
      y = Math.floor(Math.random() * (highY1 - lowY1)) + lowY1
      break
    case 2:
      x = Math.floor(Math.random() * (highX2 - lowX2 + 1)) + lowX2
      y = Math.floor(Math.random() * (highY2 - lowY2)) + lowY2
      break
    case 3:
      x = Math.floor(Math.random() * (highX3 - lowX3 + 1)) + lowX3
      y = Math.floor(Math.random() * (highY3 - lowY3)) + lowY3
      break
    case 4:
      x = Math.floor(Math.random() * (highX4 - lowX4 + 1)) + lowX4
      y = Math.floor(Math.random() * (highY4 - lowY4)) + lowY4
      break
  }
  
  return { x, y }
}

const resetAllTimeouts = () => {
  let id = window.setTimeout(() => {}, 0)
  while(id--) {
    window.clearTimeout(id)
  }
}

const resetAllIntervals = () => {
  let id = window.setInterval(() => {}, 0)
  while(id--) {
    window.clearInterval(id)
  }
}

const WRAPPER = getEl('wrapper'),
      TYPE_SCREEN = getEl('type-screen'),
      PROMPT = getEl('prompt'),
      PROMPT_LETTERS = getEl('prompt-letters'),
      PROMPT_CURSOR = getEl('prompt-cursor'),
      PROMPT_CURSOR_TRAIL = getEl('prompt-cursor-trail'),
      PROMPT_NUMBER = getEl('prompt-number-value'),
      AUTHOR = getEl('author'),
      INPUT_FIELD_LETTERS = getEl('input-field-letters'),
      TIME = getEl('time-value'),
      WPM = getEl('wpm'),
      RESET = getEl('reset'),
      PREV = getEl('prev'),
      NEXT = getEl('next'),
      HISTORY_ITEMS = getEl('history-items'),
      AVERAGE = getEl('average')

const promptList = [
  {
    text: "ХТМЛ - \"язык гипертекстовой разметки\" - самый базовый строительный блок Веба. Он определяет содержание и структуру веб-контента. Другие технологии, помимо ХТМЛ, обычно используются для описания внешнего вида, представления или функциональности, поведения веб-страницы.",
    author: 'MDN, Мотвей'
  },
  {
    text: "Под гипертекстом понимаются ссылки, которые соединяют веб-страницы друг с другом либо в пределах одного веб-сайта, либо между веб-сайтами. Ссылки являются фундаментальным аспектом Веба. Загружая контент в Интернет и связывая его со страницами, созданными другими людьми, вы становитесь активным участником Всемирной паутины.",
    author: 'MDN, Мотвей'
  },
  {
    text: "Мы уже прочли много текста в этом курсе. Много текста. Но веб был бы скучным, если бы состоял только из текста, поэтому давайте посмотрим, как оживить веб при помощи более интересного контента! Этот модуль объясняет, как при помощи ХТМЛ вставлять мультимедиа в ваши веб-страницы, включая разные способы вставки изображений, видео, аудио и также других страниц целиком.",
    author: 'MDN, Мотвей'
  },
  {
    text: "Гиперссылки очень важны. Ведь именно они делают интернет интернетом. В этой статье описан синтаксис, необходимый для создания ссылок, а также описано их наилучшее применение на практике.",
    author: 'MDN, Motvey'
  },
  {
    text: "У элементов в ХТМЛ есть атрибуты. Это дополнительные величины, которые настраивают элементы или управляют их поведением различными способами, чтобы соответствовать критериям, которые хотят пользователи.",
    author: 'MDN, Мотвей'
  }
]

const STATE = {
  user: {
    wpm: 0,
    history: []
  },
  timer: {
    isRunning: false,
    value: 60
  },
  letters: {
    height: 40,
    width: 25
  },
  prompts: {
    currentPromptIndex: 0,
    completedWordIndex: 0,
    isCurrentPromptCompleted: false,
    currentLetterIndex: {
      x: 0,
      y: 0,
      count: 0,
      successCount: 0
    },
    maxLetterIndex: {
      x: 30
    },
    list: promptList,
    minTrailSize: 20
  },
  input: {
    currentIndex: 0,
    value: ''
  }
}

let countDownTimer = null,
    speedTimer = null

const bumpCurrentPromptIndex = isUp => {
  const index = STATE.prompts.currentPromptIndex,
        nextIndex = isUp ? Math.min(index + 1, STATE.prompts.list.length - 1) 
                    : Math.max(0, index - 1)
  STATE.prompts.currentPromptIndex = nextIndex
}

const isCurrentPromptCompleted = () => STATE.prompts.isCurrentPromptCompleted

const getCurrentPrompt = () => STATE.prompts.list[STATE.prompts.currentPromptIndex]

const splitPromptByWords = () => getCurrentPrompt().text.split(' ')

const resetPromptLetterIndex = () => {
  STATE.prompts.currentLetterIndex = { x: 0, y: 0, count: 0, successCount: 0 }
}

const isInputAtMaxPromptLetters = () => {
  return STATE.prompts.currentLetterIndex.count === getCurrentPrompt().text.length
}

const bumpPromptLetterIndex = isBumpUp => {
  if(isBumpUp){
    if(STATE.prompts.currentLetterIndex.x === STATE.prompts.maxLetterIndex.x){
      STATE.prompts.currentLetterIndex.x = 0
      STATE.prompts.currentLetterIndex.y++
    }
    else{
      STATE.prompts.currentLetterIndex.x++
    }
    STATE.prompts.currentLetterIndex.count++
  }
  else{
    if(STATE.prompts.currentLetterIndex.x === 0){
      STATE.prompts.currentLetterIndex.x = STATE.prompts.maxLetterIndex.x
      STATE.prompts.currentLetterIndex.y--
    }
    else{
      STATE.prompts.currentLetterIndex.x--
    }
    STATE.prompts.currentLetterIndex.count--
  }
}

const getNextPromptLetterPos = () => {
  let x = STATE.prompts.currentLetterIndex.x * STATE.letters.width,
      y = STATE.prompts.currentLetterIndex.y * STATE.letters.height
  return { x, y }
}

const updatePromptNumber = () => {
  PROMPT_NUMBER.innerHTML = STATE.prompts.currentPromptIndex + 1
}

const getPromptSize = () => {
  let height = 0,
      width = 0
  
  if(STATE.prompts.currentLetterIndex.y === 0){
    width = (STATE.prompts.currentLetterIndex.x + 1) * STATE.letters.width
  }
  else{
    width = (STATE.prompts.maxLetterIndex.x + 1) * STATE.letters.width
  }
  
  height = (STATE.prompts.currentLetterIndex.y + 1) * STATE.letters.height
  
  return {
    height,
    width
  }
}

const setPromptCursorPos = () => {
  let count = STATE.prompts.currentLetterIndex.count,
      left = STATE.letters.width,
      top = STATE.letters.height,
      currLetter = null
  if(STATE.prompts.currentLetterIndex.count === getCurrentPrompt().text.length){
    count--
    left += STATE.letters.width
  }
  currLetter = PROMPT_LETTERS.childNodes[count]
  left += (parseInt(currLetter.dataset.left) - 1)
  top += parseInt(currLetter.dataset.top)
  setStyle(PROMPT_CURSOR, 'left', left + 'px')
  setStyle(PROMPT_CURSOR, 'top', top + 'px')
}

const clearInputField = () => {
  removeAllChildren(INPUT_FIELD_LETTERS)
  setStyle(INPUT_FIELD_LETTERS, 'width', '0px')
  STATE.input.value = ''
  STATE.input.currentIndex = 0
}

const setAuthor = author => {
  AUTHOR.innerHTML = `- ${author}`
}

const createPrompt = () => {
  const prompt = getCurrentPrompt()
  setAuthor(prompt.author)
  for(let i = 0; i < prompt.text.length; i++){
    const currentLetter = prompt.text[i],
          pos = getNextPromptLetterPos()
    const letter = document.createElement('div'),
          size = getPromptSize()
    letter.innerHTML = currentLetter
    addClass(letter, 'letter')
    setAttr(letter, 'data-letter', currentLetter)
    setAttr(letter, 'data-left', pos.x)
    setAttr(letter, 'data-top', pos.y)
    setStyle(letter, 'left', pos.x + 'px')
    setStyle(letter, 'top', pos.y + 'px')
    setStyle(PROMPT, 'height', size.height + (STATE.letters.height * 2) + 'px')
    setStyle(PROMPT, 'width', size.width + (STATE.letters.width * 2) + 'px')
    setStyle(PROMPT_LETTERS, 'height', size.height + 'px')
    setStyle(PROMPT_LETTERS, 'width', size.width + 'px')
    
    if(pos.x === 0 && currentLetter === ' '){
      addClass(letter, 'ignore')
    }
    else{
      bumpPromptLetterIndex(true)
    }
    
    PROMPT_LETTERS.appendChild(letter)
  }
  resetPromptLetterIndex()
}

const getNextInputLetterPos = () => {
  let x = STATE.input.currentIndex * STATE.letters.width
  STATE.input.currentIndex = ++STATE.input.currentIndex
  return x
}

const isValidLetter = e => {
  return !e.ctrlKey 
    && e.key !== 'Enter'
    && e.keyCode !== 8
    && e.keyCode !== 9
    && e.keyCode !== 13
}

const removeInputLetter = () => {
  if(INPUT_FIELD_LETTERS.childElementCount > 0){
    INPUT_FIELD_LETTERS.removeChild(INPUT_FIELD_LETTERS.lastChild)
    STATE.input.currentIndex = Math.max(0, --STATE.input.currentIndex)
    STATE.input.value = STATE.input.value.substring(0, STATE.input.value.length - 1)
    setStyle(INPUT_FIELD_LETTERS, 'width', (INPUT_FIELD_LETTERS.clientWidth - STATE.letters.width) + 'px')
    compareInputToPrompt()
    bumpPromptLetterIndex(false)
    setPromptCursorPos()
  }
}

const createLetter = key => {
  const letter = document.createElement('div'),
        x = getNextInputLetterPos()
  letter.innerHTML = key
  setAttr(letter, 'data-letter', key)
  addClass(letter, 'letter')
  return letter
}

const typeLetter = e => {
  const letter = createLetter(e.key)
  setStyle(INPUT_FIELD_LETTERS, 'width', (INPUT_FIELD_LETTERS.clientWidth + STATE.letters.width) + 'px')
  INPUT_FIELD_LETTERS.appendChild(letter)
  STATE.input.value += e.key
  compareInputToPrompt()
  bumpPromptLetterIndex(true)
  setPromptCursorPos()
  e.preventDefault()
}

const isAtMaxInputIndex = () => STATE.input.currentIndex > STATE.input.maxIndex

const isLastWordInPrompt = () => {
  const splitPrompt = splitPromptByWords()
  return STATE.prompts.completedWordIndex === splitPrompt.length - 1
}

const bumpCompletedWordIndex = () => {
  if(!isLastWordInPrompt()){
    ++STATE.prompts.completedWordIndex
  }
}

const getIndexRange = () => {
  const splitPrompt = splitPromptByWords()
  if(STATE.prompts.completedWordIndex === 0){
    return {
      start: 0,
      end: splitPrompt[0].length + 1
    }
  }
  else{
    let start = 0,
        end = 0,
        i = 0
    
    for(i = 0; i < STATE.prompts.completedWordIndex; i++){
      start += (splitPrompt[i].length + 1)
    }
    end = start + splitPrompt[i].length
    
    return {
      start,
      end 
    }
  }
}

const setAverage = () => {
  const avg = calcAverage()
  AVERAGE.innerHTML = `${avg} AVG`
}

const calcAverage = () => {
  let total = 0
  for(let i = 0; i < STATE.user.history.length; i++){
     total += STATE.user.history[i].wpm
  }
  return Math.round(total / STATE.user.history.length)
}

const updateHistoryList = () => {
  removeAllChildren(HISTORY_ITEMS)
  for(let i = 0; i < STATE.user.history.length; i++){
    const item = document.createElement('div'),
          itemNo = document.createElement('div'),
          testNo = document.createElement('div'),
          wpm =  document.createElement('div')
    itemContents = STATE.user.history[i]
    addClass(item, 'item')
    addClass(itemNo, 'item-no')
    itemNo.innerHTML = i + 1
    addClass(testNo, 'test-no')
    testNo.innerHTML = itemContents.testNo
    addClass(wpm, 'wpm')
    wpm.innerHTML = itemContents.wpm
    item.appendChild(itemNo)
    item.appendChild(testNo)
    item.appendChild(wpm)
    HISTORY_ITEMS.appendChild(item)
  }
}

const addHistoryItem = () => {
  STATE.user.history.push({
    wpm: STATE.user.wpm,
    testNo: STATE.prompts.currentPromptIndex + 1
  })
}

const transitionCompletedWord = () => {
  const input = STATE.input.value,
        promptIndex = getIndexRange(),
        promptOffset = getElPos(PROMPT),
        inputOffset = getElPos(PROMPT)
  
  for(let i = 0; i < input.length; i++){
    const letter = createLetter(input[i]),
          initPos = getElPos(INPUT_FIELD_LETTERS.childNodes[i]),
          finalPos = { 
            left: STATE.letters.width + parseInt(PROMPT_LETTERS.childNodes[promptIndex.start + i].dataset.left),
            top: WRAPPER.scrollTop + promptOffset.top + STATE.letters.height + parseInt(PROMPT_LETTERS.childNodes[promptIndex.start + i].dataset.top)
          }
    addClass(letter, 'flying')
    setStyle(letter, 'left', initPos.left - inputOffset.left + 'px')
    setStyle(letter, 'top', initPos.top + WRAPPER.scrollTop + 'px')
    TYPE_SCREEN.appendChild(letter)
    setTimeout(() => {
      setStyle(letter, 'transition-delay', (i * 20) + 'ms')
      setStyle(letter, 'left', finalPos.left + 'px')
      setStyle(letter, 'top', finalPos.top + 'px')
      setTimeout(() => {
        TYPE_SCREEN.removeChild(letter)
      }, 250 + (i * 20))
    }, 1)
  }
}

const checkCurrentWord = (input, word) => {
  if(isLastWordInPrompt()){
    return input === word
  }
  else{
    return input === word + ' '
  }
}

const resetPromptLetters = () => {
  for(let i = 0; i < PROMPT_LETTERS.childNodes.length; i++){
    const letter = PROMPT_LETTERS.childNodes[i]
    removeClass(letter, 'error')
    removeClass(letter, 'success')
    removeClass(letter, 'complete')
  }
}

const setPromptCursorTrailSize = size => {
  setStyle(PROMPT_CURSOR_TRAIL, 'width', size + 'px')
}

const compareInputToPrompt = () => {
  const splitPrompt = splitPromptByWords(),
        currentPrompt = getCurrentPrompt().text,
        input = STATE.input.value,
        range = getIndexRange()
  let inputIndex = 0,
      firstErrorIndex = -1,
      updatedRange = null,
      successIndex = range.start,
      i = 0
  
  if(checkCurrentWord(input, splitPrompt[STATE.prompts.completedWordIndex])){
    if(isLastWordInPrompt()){
      STATE.prompts.isCurrentPromptCompleted = true
    }
    transitionCompletedWord()
    bumpCompletedWordIndex()
    clearInputField()
  }
  
  for(i = range.start; i < PROMPT_LETTERS.childNodes.length; i++){
    const letter = PROMPT_LETTERS.childNodes[i]
    removeClass(letter, 'error')
    removeClass(letter, 'success')
    if(input[inputIndex] === letter.dataset.letter){
      if(firstErrorIndex > -1 && i >= firstErrorIndex){
        addClass(letter, 'error')
      }
      else{
        addClass(letter, 'success') 
        successIndex++
      }
    }
    else{
      if(input[inputIndex] && input[inputIndex] !== letter.dataset.letter){
        addClass(letter, 'error')
        if(firstErrorIndex === -1) firstErrorIndex = i
      }
    }
    inputIndex++
  }
  
  STATE.prompts.currentLetterIndex.successCount = successIndex
  
  updatedRange = getIndexRange()
  let end = updatedRange.start,
      delay = (updatedRange.end - updatedRange.start) * 20
  if(isCurrentPromptCompleted()){
    end = updatedRange.end
    delay = splitPrompt[splitPrompt.length - 1].length * 20
  }
  setTimeout(() => {
    for(i = 0; i < end; i++){
      const letter = PROMPT_LETTERS.childNodes[i]
      removeClass(letter, 'success')
      addClass(letter, 'complete')
    }
  }, 250 + delay)
}

const createPromptCursorTrail = () => {
  const nTrails = 4,
        inc = PROMPT_CURSOR_TRAIL.clientHeight / nTrails
  for(let i = 0; i < nTrails; i++){
    const trail = document.createElement('i'),
          delay = i * -63,
          top = i * inc
    addClass(trail, 'trail')
    addClass(trail, 'fa')
    addClass(trail, 'fa-chevron-left')
    setStyle(trail, 'top', top + 'px')
    setStyle(trail, 'animation-delay', delay + 'ms')
    PROMPT_CURSOR_TRAIL.appendChild(trail)
  }
}

const setTime = time => {
  STATE.timer.value = time
  if(time === 60){
    time = '1:00'
  }
  else{
    time = time < 10 ? `0:0${time}` : `0:${time}`
  }
  TIME.innerHTML = time
}

const calcWpm = () => {
  const successCount = STATE.prompts.currentLetterIndex.successCount,
        cps = successCount / Math.max(60 - STATE.timer.value, 1),
        cpm = cps * 60,
        wpm = Math.round(cpm / 5)
  return wpm
}

const setWpm = wpm => {
  STATE.user.wpm = wpm
  const val = document.createElement('div')
  addClass(val, 'val')
  val.innerHTML = wpm
  removeAllChildren(WPM)
  WPM.appendChild(val)
}

const toggleTimeFlashing = isFlashing => {
  if(isFlashing){
    addClass(TIME, 'blink')
  }
  else{
    removeClass(TIME, 'blink')
  }
}

const doOnTestComplete = () => {
  clearInterval(countDownTimer)
  clearInterval(speedTimer)
  addHistoryItem()
  updateHistoryList()
  setAverage()
  setPromptCursorTrailSize(STATE.prompts.minTrailSize)
  toggleTimeFlashing(true)
}

const startTimers = () => {
  countDownTimer = setInterval(() => {
    const nextTime = Math.max(0, STATE.timer.value - 1)
    setTime(nextTime)
    if(nextTime === 0){
      doOnTestComplete()
    }
  }, 1000)
  speedTimer = setInterval(() => {
    const wpm = calcWpm()
    setWpm(wpm)
    if(isCurrentPromptCompleted()){
      doOnTestComplete()
    }
    else{
      setPromptCursorTrailSize(Math.max(wpm, STATE.prompts.minTrailSize))
    }
  }, 250)
}

const handleAlternateKeys = e => {
  switch(e.keyCode){
    case 8: // Backspace
      removeInputLetter()
      e.preventDefault()
      break
    case 9: // Tab
      e.preventDefault()
      break
    case 13: // Enter
      break
    case 16: // Shift
      e.preventDefault()
      break
  }
}

const resetCurrentPrompt = () => {
  STATE.prompts.completedWordIndex = 0
  STATE.prompts.isCurrentPromptCompleted = false
  resetPromptLetterIndex()
}

const showNavButtons = () => {
  if(STATE.prompts.currentPromptIndex === 0){
    addClass(PREV, 'disabled')
  }
  else{
    removeClass(PREV, 'disabled')
  }
  
  if(STATE.prompts.currentPromptIndex === STATE.prompts.list.length - 1){
    addClass(NEXT, 'disabled')
  }
  else{
    removeClass(NEXT, 'disabled')
  }
}

const resetTest = () => {
  clearInterval(countDownTimer)
  clearInterval(speedTimer)
  STATE.timer.isRunning = false
  setTime(60)
  setWpm(0)
  clearInputField()
  resetCurrentPrompt()
  resetPromptLetters()
  setPromptCursorPos()
  setPromptCursorTrailSize(STATE.prompts.minTrailSize)
  toggleTimeFlashing(false)
}

RESET.onclick = () => {
  resetTest()
}

PREV.onclick = () => {
  resetTest()
  bumpCurrentPromptIndex(false)
  updatePromptNumber()
  removeAllChildren(PROMPT_LETTERS)
  createPrompt()
  showNavButtons()
}

NEXT.onclick = () => {
  resetTest()
  bumpCurrentPromptIndex(true)
  updatePromptNumber()
  removeAllChildren(PROMPT_LETTERS)
  createPrompt()
  showNavButtons()
}

window.onkeypress = e => {
  if(isValidLetter(e) 
     && !isAtMaxInputIndex() 
     && !isCurrentPromptCompleted()
     && !isInputAtMaxPromptLetters()){
    typeLetter(e)
    if(!STATE.timer.isRunning){
      STATE.timer.isRunning = true
      startTimers()
    }
  }
}

window.onkeydown = e => {
  handleAlternateKeys(e)
}

window.onload = () => {
  createPrompt()
  createPromptCursorTrail()
  updateHistoryList()
}