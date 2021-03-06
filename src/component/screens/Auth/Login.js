import React from 'react';
import {Dimensions, Image, Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {CustomButton, Input, Spinner} from "../../common";
import validate from '../../../Utility/validation';
import {connect} from 'react-redux';
import {loginUser} from '../../../store/actions'

class Login extends React.Component {

    constructor(props) {
        super(props);
        Dimensions.addEventListener('change', this.updateMode);

        this.state = {
            viewMode: Dimensions.get('window').height > 500 ? 'potrait' : 'landscape',
            controls: {
                email: {
                    value: '',
                    valid: false,
                    validationRules: {
                        isEmail: true
                    },
                    touched: false
                },
                password: {
                    value: '',
                    valid: false,
                    validationRules: {
                        minLength: 1
                    },
                    touched: false
                }
            },
            loading: false
        }
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.updateMode);
    }

    updateMode = (dims) => {
        this.setState({
            viewMode: dims.window.height > 500 ? 'potrait' : 'landscape'
        })
    }

    updateInputState = (key, val) => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    [key]: {
                        ...prevState.controls[key],
                        value: val,
                        valid: validate(val, prevState.controls[key].validationRules),
                        touched: true
                    }
                }
            }
        });
    }

    renderImageContainer = () => {
        const imageContainer = (
            <View style={styles.imageContainer}>
                <Image
                    style={styles.iconStyle}
                    source={require('../../../assets/loginIcon.png')}
                />
            </View>
        );

        if (this.state.viewMode === 'potrait') {
            return imageContainer;
        }
    }

    loginHandler = () => {
        const email = this.state.controls.email.value;
        const password = this.state.controls.password.value;
        this.setState({
            loading: true
        })
        this.clearError()
        this.props.log_user_in({email, password});
    }

    renderErrorMessage() {
        if (this.props.error) {
            return (
                <View style={{marginBottom: 10}}>
                    <Text style={styles.errorMsgStyle}>{this.props.error}</Text>
                </View>
            );
        }
    }

    clearError() {
        setTimeout(() => {
            this.setState({
                loading: false
            });
        }, 3000);
    }

    render() {
        return (
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
            >
                <View style={{flex: 1, backgroundColor: '#fff'}}>
                    {this.renderImageContainer()}
                    <View style={styles.inputContainer}>
                        <Input
                            secureTextEntry={false}
                            iconName={'md-mail'}
                            placeholder={'E-mail'}
                            returnKeyType={'next'}
                            keyboardType='email-address'
                            autoCorrect={false}
                            style={styles.inputStyle}
                            labelStyl={styles.labelStyle}
                            value={this.state.controls.email.value}
                            onChangeText={val => this.updateInputState('email', val)}
                            valid={this.state.controls.email.valid}
                            touched={this.state.controls.email.touched}
                        />
                        <View style={styles.passwordButtonStyle}>
                            <Input
                                secureTextEntry={true}
                                iconName={'md-lock'}
                                placeholder={'Password'}
                                labelStyl={styles.labelStyle}
                                style={styles.inputStyle}
                                value={this.state.controls.password.value}
                                onChangeText={val => this.updateInputState('password', val)}
                                valid={this.state.controls.password.valid}
                                touched={this.state.controls.password.touched}
                            />
                        </View>
                    </View>
                    {this.renderErrorMessage()}
                    <View style={styles.buttonContainer}>
                        {this.state.loading ? <Spinner size='large'/> : <CustomButton
                            onPress={this.loginHandler}
                            disable={
                                !this.state.controls.email.valid ||
                                !this.state.controls.password.valid
                            }
                        > Login
                        </CustomButton>}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        width: '100%',
        height: '45%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    },
    iconStyle: {
        width: '75%',
        height: '100%'
    },
    inputContainer: {
        width: '100%',
        marginBottom: 2
    },
    inputStyle: {
        color: '#000',
        paddingTop: 3,
        width: '80%'
    },
    labelStyle: {
        paddingLeft: 20,
        width: '20%'
    },
    passwordButtonStyle: {
        marginBottom: 10
    },
    errorMsgStyle: {
        fontSize: 10,
        alignSelf: 'center',
        color: 'red'
    },
});

const mapStateToProps = ({auth}) => {
    const {email, password, error, loading} = auth;
    return {
        email,
        password,
        error,
        loading
    };

};


const mapDispatchToProps = dispatch => {
    return {
        log_user_in: ({email, password}) => dispatch(loginUser({email, password}))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);