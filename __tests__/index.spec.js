import Logger from '../index'

const logger = new Logger({ isDevelopMode: true })
describe("Calculator tests", () => {
  test('adding 1 + 2 should return 3', () => {
    expect(logger.message({ value: 88 }))
  });
})