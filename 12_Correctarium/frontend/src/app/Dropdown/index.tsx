import React, { FC, RefObject, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface Option {
	value: string;
	label: string;
}

interface PropsType {
	options: Option[];
	value: Option;
	onChange: (value: string) => void;
	legend: string;
}

const Dropdown: FC<PropsType> = ({ options, value, onChange, legend }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState<Option>(value);
	const ref = useRef<HTMLFieldSetElement>(null);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedOption({ value: event.target.value, label: getLabel(event.target.value) });
		setIsOpen(false);
		onChange(event.target.value);
	};
	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

	const handleClickOutside = (e: MouseEvent) => {
		if (!ref || !e.target) return;
		if (!ref?.current?.contains(e.target as Node)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	}, []);

	const getLabel = (value: string) => {
		const option = options.find((option) => option.value === value);
		return option?.label || '';
	};
	return (
		<Root>
			<fieldset
				className={isOpen ? 'selector service opened' : 'selector service closed'}
				onClick={handleToggle}
				ref={ref}
			>
				<legend>{legend}</legend>
				<input type='checkbox' />
				<label htmlFor='service' className='opener'>
					<span className='label'>{selectedOption.label}</span>
					<img
						className='arrow_down'
						src='https://correctarium.com/img/arrow_down.svg'
						alt='Стрелка вниз'
					/>
				</label>
				<div className={isOpen ? 'selector_list visible' : 'selector_list hidden'}>
					{options.map((option, index) => (
						<label key={index} htmlFor={option.value} className='selector_list_item'>
							<input
								type='radio'
								name='service'
								id={option.value}
								value={option.value}
								checked={selectedOption.value === option.value}
								onChange={handleChange}
							/>
							{option.label}
						</label>
					))}
				</div>
			</fieldset>
		</Root>
	);
};

const Root = styled.div`
	fieldset {
		margin: 0 0 30px;
	}
	.selector {
		user-select: none;
		width: 358px;
		height: 74px;
		margin-top: -6px;
		overflow: visible;
		padding: 0;
		border-radius: 8px;
		border: solid 1px #eeeeee;
		font-size: 14px;
		font-weight: 500;
		font-stretch: normal;
		font-style: normal;
		line-height: 1.57;
		letter-spacing: -0.05px;
		legend {
			font-size: 12px;
			font-weight: 400;
			font-stretch: normal;
			font-style: normal;
			line-height: normal;
			letter-spacing: -0.04px;
			color: #a0a1a4;
			margin-left: 22px;
			transform: translateY(-2px);
			display: inline-block;
			height: 15px;
		}
	}
	.visible {
		visibility: visible;
	}
	.hidden {
		visibility: hidden;
	}
	.arrow_down {
		width: 8px;
		height: 8px;
		margin: auto 0 auto auto;
	}

	[type='checkbox'],
	[type='radio'] {
		box-sizing: border-box;
		padding: 0;
		display: none;
	}
	label.opener {
		line-height: 22px;
		display: flex;
		padding: 19px 20px;
		position: relative;
		align-items: center;
		top: -4px;
		cursor: pointer;
	}
	.opened {
		border-color: #0068e4;
		outline: none;
		legend {
			color: #0068e4;
		}
		.arrow_down {
			transform: rotate(180deg);
		}
	}
	.selector_list {
		width: 358px;
		margin-top: 6px;
		padding: 12px 0;
		position: absolute;
		flex-direction: column;
		overflow: visible;
		z-index: 2;
		background: #fff;
		border-radius: 8px;
		line-height: 2.29;
		box-shadow: 0 15px 66px #0000000a;
		border: solid 1px #eeeeee;
		display: flex;
		.selector_list_item {
			cursor: pointer;
			padding: 0 20px;
		}
		.selector_list_item:hover {
			background-color: #f5f5f5;
		}
	}
`;

export default Dropdown;
