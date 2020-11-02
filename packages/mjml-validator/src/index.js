import ruleError from './rules/ruleError'
import rulesCollection, { registerRule } from './MJMLRulesCollection'
import dependencies, { registerDependencies } from './dependencies'

const SKIP_ELEMENTS = ['mjml']

export const formatValidationError = ruleError

export { rulesCollection, registerRule }

export { dependencies, registerDependencies, mergeDependencies }

export default function MJMLValidator(element, options = {}) {
  const { children, tagName } = element
  const errors = []

  const skipElements = options.skipElements || SKIP_ELEMENTS

  if (options.dependencies == null) {
    console.warn('"dependencies" option should be provided to mjml validator')
  }

  if (!skipElements.includes(tagName)) {
    for (const rule of Object.values(rulesCollection)) {
      errors.push(
        ...rule(element, {
          dependencies,
          skipElements,
          ...options,
        }),
      )
    }
  }

  if (children && children.length > 0) {
    for (const child of children) {
      errors.push(...MJMLValidator(child, options))
    }
  }

  return errors
}
