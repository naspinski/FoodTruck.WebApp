import { Component } from 'react';
import * as React from 'react';
import './ShoppingCart.scss';
import { CartAction } from '../models/CartModels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SquarePaymentForm, CreditCardNumberInput, CreditCardExpirationDateInput, CreditCardPostalCodeInput, CreditCardCVVInput, CreditCardSubmitButton } from 'react-square-payment-form'
import 'react-square-payment-form/lib/default.css'
import { MDBBtn } from 'mdbreact';
import FormAlerts from './FormAlerts';
import SiteContext from '../models/SiteContext';

interface IProps {
    cartAction: (action: CartAction) => void
}

interface IState {
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
    cartPickup: string,
    paymentError: string,
    cartLocation: string,
    applicationId: string
}

export class ShoppingCart extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
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
            cartPickup: '',
            paymentError: '',
            cartLocation: '',
            applicationId: ''
        };
    }
    static contextType = SiteContext;

    pickupValues = new Map([
        [0, 'ASAP'],
        [30, '30 minutes'],
        [45, '45 minutes'],
        [60, '1 hour']
    ])

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
            if (this.state.cartLocation.length === 0 && this.context.square) {
                this.setState({ cartLocation: this.context.square[0].locationId, applicationId: this.context.square[0].applicationId });
            }
            this.props.cartAction(new CartAction({ task: 'enable' }));
        }
    }

    canSubmitPayment() { return this.state.paymentSendingState !== 'sending' && this.state.paymentSendingState !== 'sent'; }

    handleChange = (event: any) => {
        this.setState({ [event.target.name]: event.target.value } as React.ComponentState);
    }
    handlePhoneChange = (event: any) => {
        this.setState({ cartPhone: event.target.value.replace('(', '').replace(')', '').replace(' ', '').replace('-', '') });
    }

    handleLocationChange = (event: any) => {
        const location = this.context.square.find(x => x.locationId === event.target.value);
        this.setState({
            cartLocation: event.target.value,
            applicationId: location.applicationId
        });
    }

    infoSubmitHandler = event => {
        event.preventDefault();
        event.target.className += ' was-validated';
        const htmlValid = (document.getElementById(this.cartInfoFormId) as HTMLFormElement).checkValidity();

        if (htmlValid) {
            this.setCartState('payment');
        } else {
            this.setState({ infoSendingState: 'input-error' });
        }
    }
    
    render() {
        const settings = this.context.settings;
        const cart = this.context.cart;
        const items = cart.items.sort(function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });

        const pickups = settings.isBrickAndMortar
            ? Array.from(this.pickupValues.keys()).filter(x => x <= settings.minutesUntilClose)
            : Array.from(this.pickupValues.keys());
        const pickupsClassName = pickups.length > 1 ? '' : 'invisible'; 
        const isMultipleLocations = settings.square && settings.square.length > 1;
        const locationClassName = isMultipleLocations ? '' : 'invisible';
        const orderClassName = 'cart-section ' + (this.state.cartState === 'order' ? 'visible' : 'invisible');
        const infoFormClassName = 'needs-validation cart-section ' + (this.state.cartState === 'info' ? 'visible' : 'invisible');
        const paymentFormClassName = 'cart-section ' + (this.state.cartState === 'payment' ? 'visible' : 'invisible');
        const submitDisabled = !this.canSubmitPayment();
        const paymentErrorMessagePrefex = 'Error - nothing charged';
        const total = `$${(Number.parseFloat(this.state.amountInCents)/100).toFixed(2)}`;
        
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
                            <strong>SubTotal:</strong>
                            <strong>{cart.subTotalCost}</strong>
                        </div>
                    </div>
                    <div id='cart-checkout-button' className='cart-section'>
                        <MDBBtn onClick={() => this.setCartState('info')}>
                            <FontAwesomeIcon icon='shopping-cart' /> Checkout
                        </MDBBtn>
                    </div>
                </div>
                <form id={this.cartInfoFormId} className={infoFormClassName} onSubmit={(e) => this.infoSubmitHandler(e)} noValidate>
                    <fieldset className="sq-fieldset">
                        <div className={locationClassName}>
                            <span className='sq-label'>Location</span>
                            <select defaultValue={settings.square[0].locationId} id='cartLocation' name='cartLocation' className='form-control' onChange={this.handleLocationChange}>
                                {settings.square.map(location =>
                                    <option key={`location-opt-${location.locationId}`} value={location.locationId}>{location.name}</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <span className='sq-label'>First Name*</span>
                            <input required min='2' id='cartFirstName' name='cartFirstName' type='text' className='form-control sq-form-style' onChange={this.handleChange} />
                        </div>
                        <div>
                            <span className='sq-label'>Last Name*</span>
                            <input required min='2' id='cartLastName' name='cartLastName' type='text' className='form-control sq-form-style' onChange={this.handleChange} />
                        </div>
                        <div>
                            <span className='sq-label'>Phone Number</span>
                            <input id={this.cartPhoneId} name={this.cartPhoneId} type='text' className='form-control sq-form-style' onChange={this.handlePhoneChange} />
                        </div>
                        <div>
                            <span className='sq-label'>Email*</span>
                            <input required id={this.cartEmailId} name={this.cartEmailId} type='email' className='form-control sq-form-style' onChange={this.handleChange} />
                        </div>
                        <div className={pickupsClassName}>
                            <span className='sq-label'>Pick Up</span>
                            <select defaultValue='0' id='cartPickup' name='cartPickup' className='form-control' onChange={this.handleChange}>
                                {pickups.map(minutes =>
                                    <option key={`pickup-opt-${minutes}`} value={minutes}>{this.pickupValues.get(minutes)}</option>
                                )}
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
                    {this.state.cartState !== 'payment' ? '' :
                        this.context.square.filter(x => x.locationId === this.state.cartLocation).map(location => 
                        <SquarePaymentForm
                            formId={`square-form-${location.locationId}`}
                            apiWrapper=''
                            sandbox={location.applicationId.indexOf('sandbox') === 0}
                            applicationId={location.applicationId}
                            locationId={location.locationId}
                            cardNonceResponseReceived={this.cardNonceResponseReceived}
                            createVerificationDetails={() => this.createVerificationDetails()}>
                            <fieldset className="sq-fieldset">
                                    {!isMultipleLocations ? '' :
                                        <div className='bold'>
                                            <span className='sq-label'>Location: {location.name}</span>
                                        </div>}
                                <CreditCardNumberInput />
                                <div className="sq-form-third"><CreditCardExpirationDateInput /></div>
                                <div className="sq-form-third"><CreditCardPostalCodeInput /></div>
                                <div className="sq-form-third"><CreditCardCVVInput /></div>
                            </fieldset>
                            <FormAlerts sendingState={this.state.paymentSendingState}
                                errorMessage={`${paymentErrorMessagePrefex}${this.state.paymentError.length > 0 ? ` - ${this.state.paymentError}` : ''}`}
                                sentMessage='Your food will be ready shortly!' />
                            <div className='cart-square-buttons'>
                                <button className='sq-creditcard back' onClick={() => this.setCartState('info')} disabled={submitDisabled}>
                                    <FontAwesomeIcon icon='chevron-circle-left' /> Back
                            </button>
                                {submitDisabled ?
                                    <button className='sq-creditcard' disabled={true}><FontAwesomeIcon icon='chevron-circle-right' /> Pay {total}</button> :
                                    <CreditCardSubmitButton><FontAwesomeIcon icon='chevron-circle-right' /> Pay {total}</CreditCardSubmitButton>
                                }
                            </div>
                        </SquarePaymentForm>
                    )}
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
                this.setState({ paymentSendingState: 'error' });
                this.setState({ paymentError: errors.map(error => error.message).join(', ') })
                return
            } else {
                this.setState({ paymentError: '' })
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
            LocationId: this.state.cartLocation,
            Items: this.context.cart.items.map(item => new Object({
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
                    if (response.status === 400) {
                        response.text().then(err => this.setState({ paymentError: err }));
                    }
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
