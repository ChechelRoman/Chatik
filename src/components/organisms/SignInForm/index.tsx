import React, { useEffect, useState } from 'react';
import './style.scss';
import { ErrorIcon } from '../../atoms/ErrorIcon';
import { Logo } from '../../atoms/Logo';
import { Button } from '../../atoms/Button';
import { Header1, Header2 } from '../../atoms/Typography';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useHistory } from 'react-router';
import { capitalize } from '../../../utils/capitalize';
import dropdownArrow from '../../../images/dropdown-arrow.svg';
import refreshCaptchaIcon from '../../../images/refresh-captcha-icon.svg';
import cn from 'classnames';
import axios from 'axios';

interface SignInFormInputs {
  login: string;
  password: string;
  password_confirm: string;
  name: string;
  gender_id: string;
  captcha: string;
}

interface Gender {
  id: string;
  gender: string;
}

interface ResponseGender {
  genders: Gender[];
}

export const SignInForm: React.FC = () => {
  const [isDropped, setIsDropped] = useState<boolean>(false);
  const [genderList, setGenderList] = useState<Gender[]>([]);
  const [selectValue, setSelectValue] = useState<string>('');
  const [selectText, setSelectText] = useState<string>('');
  const [dateNow, setDateNow] = useState<number>(Date.now);

  useEffect(() => {
    axios
      .get<ResponseGender>('http://109.194.37.212:93/api/auth')
      .then((response) => setGenderList(response.data.genders));
  }, []);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormInputs>();

  const loginInputclasses = cn('input', {
    invalid: errors.login,
  });

  const passwordInputclasses = cn('input', {
    invalid: errors.password,
  });

  const confirmInputclasses = cn('input', {
    invalid: errors.password_confirm,
  });

  const nameInputclasses = cn('input', {
    invalid: errors.name,
  });

  const selectPlaceholderClasses = cn('placeholder_container', {
    invalid: selectText === 'Your gender',
  });

  const firstOptionClasses = cn('option first_option', {
    dropped: isDropped,
  });

  const secondOptionClasses = cn('option second_option', {
    dropped: isDropped,
  });

  const captchaInputclasses = cn('captcha_input', {
    invalid: errors.captcha,
  });

  const handleDropdown = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as Element;
    const value = target.getAttribute('data-value');
    setSelectText(value as string);
    if (value === 'male' || value === 'female') {
      const currentGender = genderList.filter((item) => item.gender === value);
      setSelectValue(currentGender[0].id);
    }

    setIsDropped(!isDropped);
  };

  const history = useHistory();
  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    const formData = new FormData();
    formData.append('login', data.login);
    formData.append('password', data.password);
    formData.append('password_confirm', data.password_confirm);
    formData.append('name', data.name);
    formData.append('gender_id', selectValue);
    formData.append('captcha', data.captcha);
    try {
      const response = await axios({
        method: 'post',
        url: 'http://109.194.37.212:93/api/auth/register',
        data: formData,
      });

      const data: boolean | string = response.data;

      if (data === true) {
        history.push('/login');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data);
      }
    }
  };

  const src = `http://109.194.37.212:93/api/auth/captcha?t=${dateNow}`;
  const handleCaptchaRefresh = () => {
    setDateNow(Date.now());
  };

  return (
    <div className="sign_form_container">
      <Logo type="login_logo" />
      <Header1>
        Sign Up to <span className="header_blue">Chatty</span>
        <span className="header_grey">!</span>
      </Header1>
      <Header2>Registration</Header2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form_field">
          <label>
            <span className="form_field__label">Create user name</span>
            <div className="form_field__input">
              <input
                {...register('login', { required: true, maxLength: 50 })}
                className={loginInputclasses}
                placeholder="Input user name"
              />
              {errors.login ? <ErrorIcon /> : null}
            </div>
          </label>
          <span className="form_field__error">
            {errors.login && 'Login is required'}
          </span>
        </div>

        <div className="form_field">
          <label>
            <span className="form_field__label">Create password</span>
            <div className="form_field__input">
              <input
                {...register('password', { required: true })}
                className={passwordInputclasses}
                placeholder="Create password"
                type="password"
              />
              {errors.password ? <ErrorIcon /> : null}
            </div>
          </label>
          <span className="form_field__error">
            {errors.password && 'Password is required'}
          </span>
        </div>

        <div className="form_field">
          <label>
            <span className="form_field__label">Password confirmation</span>
            <div className="form_field__input">
              <input
                {...register('password_confirm', { required: true })}
                className={confirmInputclasses}
                placeholder="Password confirmation"
                type="password"
              />
              {errors.password_confirm ? <ErrorIcon /> : null}
            </div>
          </label>
          <span className="form_field__error">
            {errors.password_confirm && 'Passwords do not match'}
          </span>
        </div>

        <div className="form_field">
          <label>
            <span className="form_field__label">Nickname</span>
            <div className="form_field__input">
              <input
                {...register('name', { required: true, maxLength: 50 })}
                className={nameInputclasses}
                placeholder="Nickname"
              />
              {errors.name ? <ErrorIcon /> : null}
            </div>
          </label>
          <span className="form_field__error">
            {errors.name && 'Name is required'}
          </span>
        </div>

        <div className="form_field">
          <label>
            <span className="form_field__label">Your gender</span>
            <div className="select_container">
              <div
                className={selectPlaceholderClasses}
                onClick={handleDropdown}
                data-value="Your gender">
                {selectValue === '' ? (
                  <div className="placeholder" data-value="Your gender">
                    Your gender
                  </div>
                ) : (
                  <div className="placeholder set" data-value="Your gender">
                    {capitalize(selectText)}
                  </div>
                )}
                <img
                  className="dropdown_arrow"
                  src={dropdownArrow}
                  alt="dropdown arrow"
                  data-value="Your gender"
                />
              </div>
              <div
                className={firstOptionClasses}
                data-value="male"
                onClick={handleDropdown}>
                Male
              </div>
              <div
                className={secondOptionClasses}
                data-value="female"
                onClick={handleDropdown}>
                Female
              </div>
            </div>
          </label>
          <span className="form_field__error">
            {selectText === 'Your gender' ? 'Choose your gender' : ''}
          </span>
        </div>

        <div className="form_field">
          <div className="form_field__captcha">
            <div className="input_container">
              <label>
                <span className="form_field__label">Security code</span>
                <div className="form_field__input">
                  <input
                    {...register('captcha', { required: true })}
                    className={captchaInputclasses}
                    placeholder="Security code"
                  />
                  {errors.captcha ? <ErrorIcon /> : null}
                </div>
              </label>
              <span className="form_field__error">
                {errors.captcha && 'Captcha is wrong'}
              </span>
            </div>
            <div className="captcha_container">
              <img src={src} className="captcha" alt="captcha" />
              <img
                className="refresh_icon"
                src={refreshCaptchaIcon}
                alt="refresh captcha icon"
                onClick={handleCaptchaRefresh}
              />
            </div>
          </div>
        </div>

        <Button type="submit">Register</Button>
        <Button type="button" direction="login">
          Log in
        </Button>
      </form>
    </div>
  );
};
