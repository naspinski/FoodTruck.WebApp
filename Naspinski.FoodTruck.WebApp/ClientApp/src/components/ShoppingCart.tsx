import { useContext, useState } from 'react';
import * as React from 'react';
import './ShoppingCart.scss';
import { CartAction } from '../models/CartModels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SquarePaymentForm, CreditCardNumberInput, CreditCardExpirationDateInput, CreditCardPostalCodeInput, CreditCardCVVInput, CreditCardSubmitButton } from 'react-square-payment-form'
import 'react-square-payment-form/lib/default.css'
import { MDBBtn } from 'mdbreact';
import FormAlerts, { FormAlertStates } from './FormAlerts';
import SiteContext from '../models/SiteContext';
import { NavLink } from 'react-router-dom';

interface IProps {
    cartAction: (action: CartAction) => void
}

type CartStates = 'order' | 'info' | 'payment';

const ShoppingCart = ({ cartAction }: IProps) => {

    const context = useContext(SiteContext);
    const settings = context.settings;
    const cart = context.cart;

    const [cartLocation, setCartLocation] = useState('');
    const [cartFirstName, setCartFirstName] = useState('');
    const [cartLastName, setCartLastName] = useState('');
    const [cartPhone, setCartPhone] = useState('');
    const [cartEmail, setCartEmail] = useState('');
    const [cartPickup, setCartPickup] = useState('');
    const [cartNote, setCartNote] = useState('');
    const [cartState, setCartState] = useState<CartStates>('order');

    const [infoSendingState, setInfoSendingState] = useState<FormAlertStates>('waiting');
    const [paymentSendingState, setPaymentSendingState] = useState<FormAlertStates>('waiting');
    const [amountInCents, setAmountInCents] = useState('');
    const [paymentError, setPaymentError] = useState('');
    const [paymentFormLoaded, setPaymentFormLoaded] = useState(false);
    const [cartAck, setCartAck] = useState(false);
    const [cartInfoError, setCartInfoError] = useState('Input Error');
    
    const pickupValues = new Map([
        [0, 'ASAP'],
        [30, '30 minutes'],
        [45, '45 minutes'],
        [60, '1 hour']
    ])

    const cartInfoFormId = 'cart-info-form';
    const cartEmailId = 'cartEmail';
    const cartPhoneId = 'cartPhone';
    
    const toggleCart = () => cartAction(new CartAction({ task: 'toggle' }));
    
    const formLoaded = () => setPaymentFormLoaded(true);
    const canSubmitPayment = () => { return paymentSendingState !== 'sending' && paymentSendingState !== 'sent' && paymentFormLoaded; }

    const updateCartState = (state: CartStates) => {
        setCartState(state);
        if (state === 'payment') {
            setPaymentFormLoaded(false);
            cartAction(new CartAction({ task: 'disable' }));
            populateAmount();
        } else {
            if (cartLocation.length === 0 && settings.square) {
                setCartLocation(settings.square[0].locationId);
            }
            cartAction(new CartAction({ task: 'enable' }));
        }
    }

    const handlePhoneChange = (event: any) => {
        setCartPhone(event.target.value.replace('(', '').replace(')', '').replace(' ', '').replace('-', ''));
    }

    const handleLocationChange = (event: any) => {
        const location = settings.square.find(x => x.locationId === event.target.value);
        setCartLocation(event.target.value);
    }

    const infoSubmitHandler = event => {
        event.preventDefault();
        setCartInfoError(cartAck ? 'Input Error' : 'Input Error/Need Acknowledgement');
        event.target.className += ' was-validated';
        const htmlValid = (document.getElementById(cartInfoFormId) as HTMLFormElement).checkValidity();

        if (htmlValid) {
            updateCartState('payment');
        } else {
            setInfoSendingState('input-error');
        }
    }
    
    const items = cart.items.sort(function (a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    const isMultipleLocations = settings.square && settings.square.length > 1;
    const pickups = settings.isBrickAndMortar
        ? Array.from(pickupValues.keys()).filter(x => x <= settings.minutesUntilClose)
        : Array.from(pickupValues.keys());
    const isLocationAndPickups = pickups.length > 1 && isMultipleLocations;
    const pickupsClassName = pickups.length > 1 ? (isLocationAndPickups ? 'half' : '') : 'invisible'; 
    const locationClassName = isMultipleLocations ? (isLocationAndPickups ? 'half' : '') : 'invisible';
    const orderClassName = 'cart-section ' + (cartState === 'order' ? 'visible' : 'invisible');
    const infoFormClassName = 'needs-validation cart-section ' + (cartState === 'info' ? 'visible' : 'invisible');
    const paymentFormClassName = 'cart-section ' + (cartState === 'payment' ? 'visible' : 'invisible');
    const submitDisabled = !canSubmitPayment();
    const paymentErrorMessagePrefex = 'Error - nothing charged';
    const total = isNaN(Number.parseFloat(amountInCents)) ? '[calculating]' : `$${(Number.parseFloat(amountInCents)/100).toFixed(2)}`;

    //
    // Square code (https://square.github.io/react-square-payment-form/docs/paymentform)
    //
    const cardNonceResponseReceived = (errors: any, nonce: string, cardData: any, buyerVerificationToken: string) => {
        if (canSubmitPayment()) {
            if (errors) {
                setPaymentSendingState('error');
                setPaymentError(errors.map(error => error.message).join(', '))
                return
            } else {
                setPaymentError('');
                sendPayment(nonce, buyerVerificationToken);
            }
        }
    }

    const getPaymentModel = (nonce: string, buyerVerificationToken: string): string => {
        return JSON.stringify({
            Name: `${cartFirstName} ${cartLastName}`,
            Email: cartEmail,
            Phone: cartPhone,
            Nonce: nonce,
            BuyerVerificationToken: buyerVerificationToken,
            Note: cartNote,
            PickUpInMinutes: cartPickup,
            LocationId: cartLocation,
            Items: cart.items.map(item => new Object({
                Quantity: item.quantity,
                Name: item.name,
                PriceTypeName: item.priceTypeName,
                PriceId: item.priceId,
                Note: item.parts
            }))
        });
    }

    const sendPayment = (nonce: string, buyerVerificationToken: string) => {
        if (canSubmitPayment()) {
            setPaymentSendingState('sending');
            fetch('api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: getPaymentModel(nonce, buyerVerificationToken)
            })
                .then(response => {
                    setPaymentSendingState(response.status === 200 ? 'sent' : 'error');
                    if (response.status === 400) {
                        response.text().then(err => setPaymentError(err));
                    }
                    if (response.status === 200) {
                        cart.clear();
                    }
                })
                .catch(error => {
                    console.error('error', error);
                    setPaymentSendingState('error')
                });
        }
    }

    const createVerificationDetails = () => {
        return {
            amount: amountInCents,
            currencyCode: 'USD',
            intent: 'CHARGE',
            billingContact: {
                familyName: cartLastName,
                givenName: cartFirstName,
                email: cartEmail,
                country: 'US',
                city: '',
                addressLines: [''],
                postalCode: '',
                phone: cartPhone
            }
        }
    }

    const populateAmount = () => {
        setAmountInCents('');
        fetch('/api/payment/amount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: getPaymentModel(null, null)
        })
            .then(response => response.text())
            .then((amount) => {
                setAmountInCents(amount);
            })
            .catch(error => {
                console.error('error', error);
                setAmountInCents('0');
                setPaymentSendingState('error');
            });
    }

    return (cart.isHidden ? <React.Fragment></React.Fragment> :
        <div id='cart'>
            <a id='cart-closer' onClick={toggleCart}>
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
                                        <FontAwesomeIcon className='ml2' icon='trash-alt' onClick={() => cartAction(remove)} />
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
                    <MDBBtn onClick={() => cartAction(new CartAction({ task: 'clear' }))}>
                        <FontAwesomeIcon icon='trash-alt' /> Clear
                    </MDBBtn>
                    <MDBBtn className='secondary-dark' onClick={() => updateCartState('info')}>
                        <FontAwesomeIcon icon='shopping-cart' /> Checkout
                    </MDBBtn>
                </div>
            </div>
            <form id={cartInfoFormId} className={infoFormClassName} onSubmit={(e) => infoSubmitHandler(e)} noValidate>
                <fieldset className="sq-fieldset">
                    <div>
                        <div className={locationClassName}>
                            <span className='sq-label'>Location</span>
                            <select defaultValue={settings.square[0].locationId} id='cartLocation' name='cartLocation' className='form-control' onChange={handleLocationChange}>
                                {settings.square.map(location =>
                                    <option key={`location-opt-${location.locationId}`} value={location.locationId}>{location.name}</option>
                                )}
                            </select>
                        </div>
                        <div className={pickupsClassName}>
                            <span className='sq-label'>Pick Up</span>
                            <select defaultValue='0' id='cartPickup' name='cartPickup' className='form-control' onChange={e => setCartPickup(e.target.value)}>
                                {pickups.map(minutes =>
                                    <option key={`pickup-opt-${minutes}`} value={minutes}>{pickupValues.get(minutes)}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div>
                        <div className='half'>
                            <span className='sq-label'>First Name*</span>
                            <input required min='2' id='cartFirstName' name='cartFirstName' type='text' className='form-control sq-form-style' onChange={e => setCartFirstName(e.target.value)} />
                        </div>
                        <div className='half'>
                            <span className='sq-label'>Last Name*</span>
                            <input required min='2' id='cartLastName' name='cartLastName' type='text' className='form-control sq-form-style' onChange={e => setCartLastName(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <div className='half'>
                            <span className='sq-label'>Email*</span>
                            <input required id={cartEmailId} name={cartEmailId} type='email' className='form-control sq-form-style' onChange={e => setCartEmail(e.target.value)} />
                        </div>
                        <div className='half'>
                            <span className='sq-label'>Phone Number</span>
                            <input id={cartPhoneId} name={cartPhoneId} type='text' className='form-control sq-form-style' onChange={handlePhoneChange} />
                        </div>
                    </div>
                    <div>
                        <div className='half'>
                            <span className='sq-label'>Note</span>
                            <textarea id='cartNote' name='cartNote' className='form-control sq-form-style' onChange={e => setCartNote(e.target.value)} />
                        </div>
                        <div className='check half'>
                            <span className='sq-label'>Acknowledge <NavLink to='/terms'>Terms</NavLink></span>
                            <input required id='cartAck' name='cartAck' className='form-control sq-form-style' type='checkbox' onChange={e => setCartAck(!cartAck)} />
                        </div>
                    </div>
                </fieldset>
                <FormAlerts sendingState={infoSendingState} inputErrorMessage={cartInfoError} />
                <div className='cart-square-buttons'>
                    <button className='sq-creditcard back' onClick={(event) => { event.preventDefault(); updateCartState('order') }}>
                        <FontAwesomeIcon icon='chevron-circle-left' /> Back
                    </button>
                    <button type='submit' className='sq-creditcard'>
                        <FontAwesomeIcon icon='chevron-circle-right' /> Payment
                    </button>
                </div>
            </form>
            <div id='cart-payment-form' className={paymentFormClassName}>
                {cartState !== 'payment' ? '' :
                    settings.square.filter(x => x.locationId === cartLocation).map(location =>
                        <SquarePaymentForm
                            key={`spf-${location.locationId}`}
                            formId={`square-form-${location.locationId}`}
                            apiWrapper=''
                            sandbox={location.applicationId.indexOf('sandbox') === 0}
                            applicationId={location.applicationId}
                            locationId={location.locationId}
                            cardNonceResponseReceived={cardNonceResponseReceived}
                            paymentFormLoaded={formLoaded}
                            createVerificationDetails={() => createVerificationDetails()}>
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
                            <FormAlerts sendingState={paymentSendingState}
                                errorMessage={`${paymentErrorMessagePrefex}${paymentError.length > 0 ? ` - ${paymentError}` : ''}`}
                                sentMessage='Your food will be ready shortly!' />
                            <div className='cart-square-buttons'>
                                <button className='sq-creditcard back' onClick={() => updateCartState('info')} disabled={submitDisabled}>
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
        </div>
    );
}
export default ShoppingCart;