import { Component } from 'react';
import * as React from 'react';
import './ShoppingCart.scss';
import { CartAction, Cart, CartItem } from '../models/CartModels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SquarePaymentForm, CreditCardNumberInput, CreditCardExpirationDateInput, CreditCardPostalCodeInput, CreditCardCVVInput, CreditCardSubmitButton } from 'react-square-payment-form'
import 'react-square-payment-form/lib/default.css'
import { SiteSettings } from '../models/SiteSettings';
import { MDBBtn } from 'mdbreact';
import FormAlerts from './FormAlerts';
import { RegularExpressions } from '../Utility';

interface IProps {
    cart: Cart,
    cartAction: (action: CartAction) => void,
    settings: SiteSettings
}

interface IState {
    errorMessages: string[],
    cartFirstName: string,
    cartLastName: string,
    cartEmail: string,
    cartPhone: string,
    infoSendingState: 'waiting' | 'sending' | 'sent' | 'error' | 'input-error',
    paymentSendingState: 'waiting' | 'sending' | 'sent' | 'error' | 'input-error',
    cartState: 'order' | 'info' | 'payment'
    nonce: string,
    cartNote: string,
    amountInCents: string,
    cartPickup: string
}

export class ShoppingCart extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            errorMessages: [],
            cartFirstName: '',
            cartLastName: '',
            cartEmail: '',
            cartPhone: '',
            infoSendingState: 'waiting',
            paymentSendingState: 'waiting',
            nonce: '',
            cartState: 'order',
            cartNote: '',
            amountInCents: '0',
            cartPickup: ''
        };
    }

    cartInfoFormId = 'cart-info-form';
    cartEmailId = 'cartEmail';
    cartPhoneId = 'cartPhone';
    
    toggleCart = () => this.props.cartAction(new CartAction({ task: 'toggle' }));
    setCartState = (state: 'order' | 'info' | 'payment') => {
        this.setState({ cartState: state })
        if (state === 'payment') {
            this.props.cartAction(new CartAction({ task: 'disable' }));
            this.populateAmount();
        } else {
            this.props.cartAction(new CartAction({ task: 'enable' }));
        }
    }

    canSubmitPayment() { return this.state.paymentSendingState !== 'sending' && this.state.paymentSendingState !== 'sent'; }

    handleChange = (event: any) => {
        console.log(`[${event.target.name}]: ${event.target.value}`);
        this.setState({ [event.target.name]: event.target.value } as React.ComponentState);
    }
    handlePhoneChange = (event: any) => {
        this.setState({ cartPhone: event.target.value.replace('(', '').replace(')', '').replace(' ', '').replace('-', '') });
    }


    infoSubmitHandler = event => {
        event.preventDefault();
        event.target.className += ' was-validated';
        const htmlValid = (document.getElementById(this.cartInfoFormId) as HTMLFormElement).checkValidity();

        const validPhone = RegularExpressions.phone.test(this.state.cartPhone);
        (document.getElementById(this.cartPhoneId) as HTMLFormElement).setCustomValidity(validPhone ? '' : 'invalid phone');

        if (htmlValid && validPhone) {
            this.setState({ infoSendingState: 'waiting' });
            this.setCartState('payment');
        } else {
            this.setState({ infoSendingState: 'input-error' });
        }
    }
    
    render() {
        const settings = this.props.settings;
        const cart = this.props.cart;
        const items = cart.items.sort(function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        const orderClassName = 'cart-section ' + (this.state.cartState === 'order' ? 'visible' : 'invisible');
        const infoFormClassName = 'needs-validation cart-section ' + (this.state.cartState === 'info' ? 'visible' : 'invisible');
        const paymentFormClassName = 'cart-section ' + (this.state.cartState === 'payment' ? 'visible' : 'invisible');
        const submitDisabled = !this.canSubmitPayment();

        return (cart.isHidden ? '' :
            <div id='cart'>
                <a id='cart-closer' onClick={this.toggleCart}>
                    <FontAwesomeIcon icon='caret-down' />
                </a>
                <div className={orderClassName}>
                    <ul>
                        {items.map(item => {
                            const remove = new CartAction({
                                task: 'remove',
                                key: item.key
                            });
                            const itemKey = `cart-item-${item.key}`;
                            const size = item.priceTypeName.length === 0 ? '' : <span className='normal f7'> ({item.priceTypeName})</span>

                            return (
                                <li key={itemKey}>
                                    <div className='flex justify-between'>
                                        <strong>
                                            [{item.quantity}] {item.name}{size}
                                        </strong>
                                        <span>
                                            {item.totalCost}
                                            <FontAwesomeIcon className='ml2' icon='trash-alt' onClick={() => this.props.cartAction(remove)} />
                                        </span>
                                    </div>
                                    <div className='f7 pl2'>{item.parts}</div>
                                </li>
                            )
                        })}
                    </ul>
                    <div id='cart-total' className='cart-section'>
                        <div>
                            <span>SubTotal:</span>
                            <span>{cart.subTotalCost}</span>
                        </div>
                        <div>
                            <span>Tax:</span>
                            <span>{cart.taxCost}</span>
                        </div>
                        <div>
                            <strong>Total:</strong>
                            <strong>{cart.totalCost}</strong>
                        </div>
                    </div>
                    <div id='cart-checkout-button' className='cart-section'>
                        <MDBBtn onClick={() => this.setCartState('info')}>
                            <FontAwesomeIcon icon='shopping-cart' /> Checkout
                        </MDBBtn>
                    </div>
                </div>
                <form id={this.cartInfoFormId} className={infoFormClassName} onSubmit={this.infoSubmitHandler} noValidate>
                    <fieldset className="sq-fieldset">
                        <div>
                            <span className='sq-label'>First Name</span>
                            <input required min='2' id='cartFirstName' name='cartFirstName' type='text' className='form-control sq-form-style' onChange={this.handleChange} />
                        </div>
                        <div>
                            <span className='sq-label'>Last Name</span>
                            <input required min='2' id='cartLastName' name='cartLastName' type='text' className='form-control sq-form-style' onChange={this.handleChange} />
                        </div>
                        <div>
                            <span className='sq-label'>Phone Number</span>
                            <input required id={this.cartPhoneId} name={this.cartPhoneId} type='text' className='form-control sq-form-style' onChange={this.handlePhoneChange} />
                        </div>
                        <div>
                            <span className='sq-label'>Email</span>
                            <input required id={this.cartEmailId} name={this.cartEmailId} type='email' className='form-control sq-form-style' onChange={this.handleChange} />
                        </div>
                        <div>
                            <span className='sq-label'>Pick Up</span>
                            <select defaultValue='0' id='cartPickup' name='cartPickup' className='form-control' onChange={this.handleChange}>
                                <option value='0'>ASAP</option>
                                <option value='30'>in 30 minutes</option>
                                <option value='45'>in 45 minutes</option>
                                <option value='60'>in 1 hour</option>
                            </select>
                        </div>
                        <div>
                            <span className='sq-label'>Note</span>
                            <textarea id='cartNote' name='cartNote' className='form-control sq-form-style' onChange={this.handleChange} />
                        </div>
                    </fieldset>
                    <FormAlerts sendingState={this.state.infoSendingState} />
                    <div className='cart-square-buttons'>
                        <button className='sq-creditcard back' onClick={(event) => { event.preventDefault(); this.setCartState('order') }}>
                            <FontAwesomeIcon icon='chevron-circle-left' /> Back
                        </button>
                        <button type='submit' className='sq-creditcard'>
                            <FontAwesomeIcon icon='chevron-circle-right' /> Payment
                        </button>
                    </div>
                </form>
                <div id='cart-payment-form' className={paymentFormClassName}>
                    <SquarePaymentForm
                        formId='square-form'
                        apiWrapper=''
                        sandbox={this.props.settings.squareSandbox}
                        applicationId={this.props.settings.squareApplicationId}
                        locationId={this.props.settings.squareLocationId}
                        cardNonceResponseReceived={this.cardNonceResponseReceived}
                        createVerificationDetails={() => this.createVerificationDetails()}>
                        <fieldset className="sq-fieldset">
                            <CreditCardNumberInput />
                            <div className="sq-form-third">
                                <CreditCardExpirationDateInput />
                            </div>

                            <div className="sq-form-third">
                                <CreditCardPostalCodeInput />
                            </div>

                            <div className="sq-form-third">
                                <CreditCardCVVInput />
                            </div>
                        </fieldset>
                        <FormAlerts sendingState={this.state.paymentSendingState}
                            errorMessage={`Error - nothing charged ${(settings.contactPhone === null || settings.contactPhone.length < 10 ? '' : `- order by phone at ${settings.contactPhone}`)}`}
                            sentMessage='Your food will be ready shortly!' />
                        <div className='cart-square-buttons'>
                            <button className='sq-creditcard back' onClick={() => this.setCartState('info')} disabled={submitDisabled}>
                                <FontAwesomeIcon icon='chevron-circle-left' /> Back
                            </button>
                            {submitDisabled ?
                                <button className='sq-creditcard' disabled={true}>
                                    <FontAwesomeIcon icon='chevron-circle-right' /> Pay
                                </button> :
                                <CreditCardSubmitButton>
                                    <FontAwesomeIcon icon='chevron-circle-right' /> Pay
                                </CreditCardSubmitButton>
                            }
                        </div>
                    </SquarePaymentForm>
                </div>
                }
            </div>
        )
    }

    //
    // Square code (https://square.github.io/react-square-payment-form/docs/paymentform)
    //
    cardNonceResponseReceived = (errors: any, nonce: string, cardData: any, buyerVerificationToken: string) => {
        if (this.canSubmitPayment()) {
            if (errors) {
                this.setState({ paymentSendingState: 'input-error' });
                this.setState({ errorMessages: errors.map(error => error.message) })
                return
            } else {
                this.setState({ errorMessages: [] })
                this.sendPayment(nonce, buyerVerificationToken);
            }
        }
    }

    getPaymentModel(nonce: string, buyerVerificationToken: string): string {
        return JSON.stringify({
            Name: `${this.state.cartFirstName} ${this.state.cartLastName}`,
            Email: this.state.cartEmail,
            Phone: this.state.cartPhone,
            Nonce: nonce,
            BuyerVerificationToken: buyerVerificationToken,
            Note: this.state.cartNote,
            PickUpInMinutes: this.state.cartPickup,
            Items: this.props.cart.items.map(item => new Object({
                Quantity: item.quantity,
                Name: item.name,
                PriceTypeName: item.priceTypeName,
                PriceId: item.priceId,
                Note: item.parts
            }))
        });
    }

    async sendPayment(nonce: string, buyerVerificationToken: string) {
        if (this.canSubmitPayment()) {
            this.setState({ paymentSendingState: 'sending' });
            fetch('api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: this.getPaymentModel(nonce, buyerVerificationToken)
            })
                .then(response => {
                    this.setState({ paymentSendingState: response.status === 200 ? 'sent' : 'error' });
                })
                .catch(error => {
                    console.error('error', error);
                    this.setState({ paymentSendingState: 'error' })
                });
        }
    }

    createVerificationDetails() {
        return {
            amount: this.state.amountInCents,
            currencyCode: 'USD',
            intent: 'CHARGE',
            billingContact: {
                familyName: this.state.cartLastName,
                givenName: this.state.cartFirstName,
                email: this.state.cartEmail,
                country: 'US',
                city: '',
                addressLines: [''],
                postalCode: '',
                phone: this.state.cartPhone
            }
        }
    }

    async populateAmount() {
        fetch('/api/payment/amount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: this.getPaymentModel(null, null)
        })
            .then(response => response.text())
            .then((amount) => {
                this.setState({ amountInCents: amount });
            })
            .catch(error => {
                console.error('error', error);
                this.setState({ paymentSendingState: 'error' })
            });
    }
}
