beforeEach(() => {
  cy.visit('https://tststore123.myshopify.com/?preview_theme_id=135449575654')
  cy.get('#password').type('audrop{enter}')
})

// Page Load
describe('Pages Load Successfully', () => {
  it('Home Loads', () => {
    cy.visit('/')
  })
  it('PLP Loads', () => {
    cy.visit('/collections/all')
  })
  it('Contact Us Loads', () => {
    cy.visit('/pages/contact')
  })
  it('Cart Loads', () => {
    cy.visit('/cart')
  })
})


// Successful Login
// requires an already made account
describe('Login', () => {
  it('Can Login', () => {
    cy.visit('/')
    cy.get('.icon-login').click()

    cy.get('#CustomerEmail').type('jacksongrowson@gmail.com')

    cy.get('#CustomerPassword').type('password1{enter}').then(() => {
      // might activate recaptcha
      if(!(location.pathname === "/challenge")){
        cy.get('.section-header').should('contain', 'My Account')
      } else {
        cy.get('.recaptcha-checkbox-checkmark').click()
        cy.get('.shopify-challenge__button').click()
        cy.get('.section-header').should('contain', 'My Account')
      }
    })
  })
})


// Add to Cart
// Start Checkout (Checkout page load)
describe('Cart and Checkout', () => {
  it('Add to cart and enter checkout', () => {
    cy.intercept('POST', '/cart/add.js').as('addToCart')
    cy.visit('/collections/all')
    cy.get('.product-card').first().click()
    cy.get('[data-add-to-cart-text]').click()

    cy.wait('@addToCart').then((interception) => {
      expect(interception.response.statusCode).to.equal(200)
    })

    cy.get('.cart__submit').click()
    cy.get('#main-header').should('contain', 'Contact information')

  })
})
