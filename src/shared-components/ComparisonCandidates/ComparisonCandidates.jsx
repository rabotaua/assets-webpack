import { h, Component } from 'preact'

const calcDudesCount = (partVal = 1) => partVal < 15 ? 1 : Math.round(partVal * 0.1)

const DudeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="9" height="24" viewBox="0 0 9 24"><path fill="#DDD" fill-rule="nonzero" d="M6.249 14.46h.385a1.58 1.58 0 0 0 1.58-1.58V7.172a1.58 1.58 0 0 0-1.58-1.58H1.58A1.58 1.58 0 0 0 0 7.172v5.708c0 .873.708 1.58 1.58 1.58h.387a1.236 1.236 0 0 0-.003.086v8.236c0 .672.545 1.218 1.218 1.218h1.852c.672 0 1.218-.546 1.218-1.218v-8.236c0-.029-.001-.058-.003-.086zM4.107 4.92a2.46 2.46 0 1 1 0-4.921 2.46 2.46 0 0 1 0 4.921z"/></svg>

const partsRepeater = (itemsArray = [], collapseView = false) => {
	return itemsArray['parts'].map((part, index) => {
		if (!part) return null

		/* we get array with length of count dudes */
		const dudesRepeater = [...new Array(calcDudesCount(part))]
		const isHit = index === 1
		const blockClass = `f-cmprs-cands__parts-item ${isHit ? '-hit' : ''}`

		return <div style={{ width: `${part}%` }} className={blockClass}>
			<p className={isHit ? 'fd-fat-craftsmen' : 'fd-beefy-craftsmen'}>{part}%</p>
			{!collapseView ? dudesRepeater.map(() => <DudeIcon/>) : null}
		</div>
	})
}

const PercentDescription = ({ parts, text, dictionary }) => {

	const descriptionText = {
		0: dictionary.lessThan,
		1: dictionary.equalTo,
		2: dictionary.moreThan
	}

	return <div>
		{parts.map((part, index) => {
			if (!part) return null

			const isHit = index === 1

			return <div className="f-cmprs-cands__percent-descr fd-f-left fd-craftsmen">
				<p className={`fd-${isHit ? 'fat' : 'beefy'}-craftsmen f-cmprs-cands__percent-descr-value ${isHit ? '-hit' : ''}`}>
					{part}%
				</p>
				{isHit
					? <div className="f-text-dark-gray">
						<span>{descriptionText[index]}</span>&nbsp;
						<span className="fd-fat-craftsmen">{text}</span>
					</div>
					: <p>{descriptionText[index]}</p>
				}
			</div>
		})}
	</div>
}


const InsufficientData = ({ collapseView, compactMode, dictionary }) => {
	if (collapseView) return null

	return <div className={`f-cmprs-cands -yellow ${ compactMode ? '-compact' : '' }`}>
		<div className="f-cmprs-cands__unsuff-wrap">
			<div className="fd-f-left-middle">
				<img className="f-cmprs-cands__unsuff-pic" src={`${ruavars.cloudImages}/2017/06/insufficient-data-icon.svg`} alt="insufficient-data"/>
				<p className="fd-craftsmen">
				<span className={compactMode ? 'fd-craftsmen' : 'fd-fat-craftsmen'}>
					{dictionary.titleBold} &nbsp;
				</span>
					{dictionary.title}
				</p>
			</div>
		</div>

		{!compactMode ? <div>
			<p className="fd-craftsmen" style={{ margin: '20px 0 5px' }}>
				{dictionary.subTitle}
			</p>
			<div className="f-cmprs-cands__unsuff-vac">
				<img src={`${ruavars.cloudImages}/2017/06/insufficient-vacancy.svg`} alt=""/>
			</div>

			<div className="fd-f-between" style={{ marginTop: 22 }}>
				<div className="fd-f1 f-cmprs-cands__salary-block">
					<h4 className="fd-fat-craftsmen f-text-dark-gray">
						{dictionary.salaryExpect}
					</h4>
					<img className="f-cmprs-cands__unsuff-skeleton" src={`${ruavars.cloudImages}/2017/06/insufficient-salary.svg`} alt="salary"/>
				</div>
				<div className="fd-f1 f-cmprs-cands__exp-block">
					<h4 className="fd-fat-craftsmen f-text-dark-gray">
						{dictionary.experienceExpect}
					</h4>
					<img className="f-cmprs-cands__unsuff-skeleton" src={`${ruavars.cloudImages}/2017/06/insufficient-exp.svg`} alt="experience"/>
				</div>
			</div>
		</div> : null}

	</div>
}

const YetNotAvailable = ({ surveyLink, collapseView, dictionary, compactMode }) => {
	return !collapseView ? <div className={`f-cmprs-cands -orange ${ compactMode ? '-compact' : '' }`}>
		<div className="f-cmprs-cands__unsuff-wrap">
			<div className="fd-f-left">
				<img className="f-cmprs-cands__unsuff-pic" src={`${ruavars.cloudImages}/2017/06/insufficient-data-icon.svg`} alt="insufficient-data"/>
				<p className="fd-craftsmen">
					{dictionary.descr}
					<span style={{ display: 'block', marginTop: 10 }}>
						<a href={surveyLink}>{dictionary.passSurvey}</a>
					</span>
				</p>
			</div>
		</div>
	</div> : null
}

export default class ComparisonCandidates extends Component {
	render() {

		const { yetNotAvailable, surveyLink, showInsufficientData, dictionary, collapseView, compactMode } = this.props

		if (yetNotAvailable) {
			return <YetNotAvailable surveyLink={surveyLink} dictionary={dictionary.yetNotAvailable} collapseView={collapseView} compactMode={compactMode} />
		}

		if (showInsufficientData) {
			return <InsufficientData dictionary={dictionary.unsuff} collapseView={collapseView} compactMode={compactMode}/>
		}

		const { salary, experience } = this.props

		return <div className="f-cmprs-cands">
			<div className="fd-f-between">
				<div className="fd-f1 f-cmprs-cands__salary-block">
					<h4 className="fd-fat-craftsmen f-text-dark-gray f-cmprs-cands__part-title">{dictionary.salary.expect}</h4>
					<div className="fd-f-left f-cmprs-cands__parts fd-beefy-serf">
						{partsRepeater(salary, collapseView)}
					</div>

					{!collapseView ? <PercentDescription dictionary={dictionary.salary} text={salary.text} parts={salary.parts}/> : null}
				</div>
				<div className="fd-f1 f-cmprs-cands__exp-block">
					<h4 className="fd-fat-craftsmen f-text-dark-gray f-cmprs-cands__part-title">{dictionary.experience.expect}</h4>
					<div className="fd-f-left f-cmprs-cands__parts fd-beefy-serf">
						{partsRepeater(experience, collapseView)}
					</div>

					{!collapseView ? <PercentDescription dictionary={dictionary.experience} parts={experience.parts} text={experience.text}/> : null}
				</div>
			</div>
		</div>
	}
}
