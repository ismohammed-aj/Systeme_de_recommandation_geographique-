import { useCallback, useEffect, useRef, useState } from 'react'

const feedbackDuration = 520

const normalizeFieldValues = (fieldValues = {}) =>
  Object.fromEntries(
    Object.entries(fieldValues).map(([name, value]) => [
      name,
      String(value ?? ''),
    ]),
  )

export function useInputFeedback(initialFieldValues = {}) {
  const [inputFeedback, setInputFeedback] = useState({})
  const fieldValuesRef = useRef(normalizeFieldValues(initialFieldValues))
  const feedbackTimersRef = useRef({})

  const clearFeedbackTimers = useCallback(() => {
    Object.values(feedbackTimersRef.current).forEach(window.clearTimeout)
    feedbackTimersRef.current = {}
  }, [])

  useEffect(() => clearFeedbackTimers, [clearFeedbackTimers])

  const resetInputFeedback = useCallback((fieldValues = initialFieldValues) => {
    clearFeedbackTimers()
    fieldValuesRef.current = normalizeFieldValues(fieldValues)
    setInputFeedback({})
  }, [clearFeedbackTimers, initialFieldValues])

  const updateInputFeedback = useCallback((name, nextValue) => {
    const normalizedValue = String(nextValue ?? '')
    const previousLength = fieldValuesRef.current[name]?.length ?? 0
    const nextLength = normalizedValue.length

    fieldValuesRef.current = {
      ...fieldValuesRef.current,
      [name]: normalizedValue,
    }

    if (nextLength === previousLength) {
      return
    }

    const feedbackClass = nextLength > previousLength
      ? 'input-typing'
      : 'input-deleting'

    window.clearTimeout(feedbackTimersRef.current[name])
    setInputFeedback((currentFeedback) => ({
      ...currentFeedback,
      [name]: feedbackClass,
    }))

    feedbackTimersRef.current[name] = window.setTimeout(() => {
      setInputFeedback((currentFeedback) => ({
        ...currentFeedback,
        [name]: '',
      }))
    }, feedbackDuration)
  }, [])

  return {
    inputFeedback,
    resetInputFeedback,
    updateInputFeedback,
  }
}
