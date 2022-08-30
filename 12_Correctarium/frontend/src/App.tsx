import React, { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Dropdown from './app/Dropdown';
import Input from './app/Input';
import useAxios from 'axios-hooks';
import axios from 'axios';

interface Deadline {
	deadline: number;
	deadlineDate: string;
	price: number;
	time: number;
}

const App: FC = () => {
	const serviceOptions = [
		{ label: 'Редактирование', value: 'edit' },
		{ label: 'Перевод', value: 'translate' },
	];
	const editLangOptions = [
		{ label: 'Украинский', value: 'ua' },
		{ label: 'Русский', value: 'ru' },
		{ label: 'Английский', value: 'en' },
		{ label: 'Английский (носитель)', value: 'en_native' },
	];
	const translateLangOptions = [
		{ label: 'Украинский/русский - английский', value: 'ua/ru_en' },
		{ label: 'Английский - украинский', value: 'en_ua' },
		{ label: 'Английский - русский', value: 'en_ru' },
		{ label: 'Русский - украинский', value: 'ru_ua' },
		{ label: 'Украинский - русский', value: 'ua_ru' },
	];
	const [deadline, setDeadline] = useState({
		deadline: 0,
		deadlineDate: '',
		price: 0,
		time: 0,
	});

	const fetchData = useCallback(async (body): Promise<Deadline> => {
		const { data } = await axios.post<Deadline>('http://localhost:80/calc', body);
		return data;
	}, []);

	const [form, setForm] = useState({
		service: serviceOptions[0].value,
		text: '',
		email: null,
		name: null,
		comment: null,
		lang: '',
	});

	const handleBlur = useCallback(
		async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string, field) => {
			let value = '';
			if (typeof event === 'string') {
				value = event;
			} else {
				value = event.target.value;
			}
			setForm((prev) => ({ ...prev, [field]: value }));
			const lang = form.lang.includes('en') ? 'en' : form.lang.includes('ru') ? 'ru' : 'ua';
			const body = {
				language: lang,
				mimetype: 'docx',
				count: form.text.length,
			};
			const res = await fetchData(body);
			setDeadline({
				deadline: res.deadline,
				deadlineDate: res.deadlineDate,
				price: res.price,
				time: res.time,
			});
		},
		[form, setForm, fetchData],
	);

	return (
		<Root>
			<div className='wrapper'>
				<div className='title'>Заказать перевод или редактирование текста</div>
				<div className='form-wrapper'>
					<div className='left-column'>
						<Dropdown
							options={serviceOptions}
							value={serviceOptions[0]}
							onChange={(value) => handleBlur(value, 'service')}
							legend='Услуга'
						/>
						<textarea
							placeholder={'Введите текст'}
							onBlur={(event) => handleBlur(event, 'text')}
						/>
						<div className='input-group'>
							<Input
								placeholder='Ваша электронная почта'
								type='email'
								blur={(event) => handleBlur(event, 'email')}
							></Input>
							<Input
								placeholder='Ваше имя'
								type='text'
								blur={(event) => handleBlur(event, 'name')}
							></Input>
							<Input
								placeholder='Комментарий'
								type='text'
								blur={(event) => handleBlur(event, 'comment')}
							></Input>
							<Dropdown
								options={
									form.service === 'edit' ? editLangOptions : translateLangOptions
								}
								value={
									form.service === 'edit'
										? editLangOptions[0]
										: translateLangOptions[0]
								}
								onChange={(value) => handleBlur(value, 'lang')}
								legend='Услуга'
							/>
						</div>
					</div>
					<div className='right-column'>
						<div className='price'>
							<div className='price-number'>{deadline.price}</div>
							<div className='price-currency'>грн</div>
						</div>
						<div className='deadline'>
							{deadline.time !== 0 && (
								<>
									<div className='deadline-title'>Срок выполнения</div>
									<div className='deadline-date'>{deadline.deadlineDate}</div>
								</>
							)}
						</div>
						<button className='order-btn' type='button'>
							Заказать
						</button>
					</div>
				</div>
			</div>
		</Root>
	);
};

export default App;

const Root = styled.div`
	width: 100vw;
	display: flex;
	justify-content: center;
	align-items: center;
	.wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		padding-left: 120px;
		padding-right: 120px;
		padding-top: 80px;
		border-radius: 16px;
		flex-direction: column;
		.title {
			width: 100%;
			height: 100px;
			font-size: 30px;
			font-weight: 500;
			font-stretch: normal;
			font-style: normal;
			line-height: 1.47;
			letter-spacing: normal;
			margin: 0;
			max-width: 100%;
		}
		.form-wrapper {
			display: flex;
			width: 100%;
			justify-content: space-between;

			.left-column {
				max-width: 800px;
				width: 75%;

				.input-group {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					fieldset:first-child {
						margin-bottom: 20px;
					}
				}
			}
			.right-column {
				.price {
					display: flex;
					align-items: baseline;
					.price-number {
						margin-left: auto;
						font-size: 60px;
						font-weight: 100;
						font-stretch: normal;
						font-style: normal;
						line-height: 1.37;
						letter-spacing: -0.19px;
						text-align: right;
						color: #0068e4;
					}
					.price-currency {
						color: #0068e4;
						margin-bottom: 13px;
					}
				}
				.order-btn {
					width: 260px;
					min-width: 200px;
					display: inline-block;
					text-align: center;
					background-color: #1b2235;
					color: #fff;
					text-decoration: none;
					padding: 18px 20px;
					font-size: 16px;
					font-weight: 500;
					font-stretch: normal;
					font-style: normal;
					line-height: normal;
					letter-spacing: -0.05px;
					cursor: pointer;
					border: none;
					border-radius: 8px;
					box-shadow: 0 11px 19px #00000029;
				}
				.order-btn:disabled {
					box-shadow: 0 7px 14px #00000029;
					background-color: #252e47;
					color: #ffffff4d;
				}
			}
		}

		textarea {
			resize: none;
			width: 80%;
			min-height: 200px;
			border-radius: 16px;
			border: 1px solid #eee;
			outline: none;
			padding: 20px 30px;
			margin-bottom: 25px;
		}

		.input {
		}
	}
`;
