import { ChangeEvent, FC, useState } from 'react';
import styled from 'styled-components';

interface PropsType {
	placeholder: string;
	type: string;
	blur: (value: ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<PropsType> = ({ placeholder, blur, type }) => {
	const [isFocused, setIsFocused] = useState(false);
	const handleFocus = () => {
		setIsFocused(true);
	};
	const handleBlur = (event: ChangeEvent<HTMLInputElement>) => {
		setIsFocused(false);
		blur(event);
	};
	return (
		<Fieldset className={isFocused ? `text_field ${type} focused` : `text_field ${type}`}>
			<input
				className='placeholder'
				type={type}
				placeholder={placeholder}
				onBlur={handleBlur}
				onFocus={handleFocus}
			/>
		</Fieldset>
	);
};

const Fieldset = styled.fieldset`
	width: 345px;
	height: 68px;
	padding: 0;
	border-radius: 8px;
	border: solid 1px #eeeeee;
	outline: none;
	font-size: 14px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: 1.57;
	letter-spacing: -0.05px;
	input {
		width: 315px;
		height: 60px;
		background: transparent;
		line-height: 22px;
		padding: 19px 20px;
		position: relative;
		top: -14px;
		border: none;
		outline: none;
		font-size: 14px;
		font-weight: 500;
		font-stretch: normal;
		font-style: normal;
		letter-spacing: -0.05px;
	}
	&.focused {
		&::before {
			content: '';
			position: absolute;

			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			border: 2px solid #3a3a3a;
			border-radius: 5px;
			z-index: -1;
		}
	}
`;

export default Input;
