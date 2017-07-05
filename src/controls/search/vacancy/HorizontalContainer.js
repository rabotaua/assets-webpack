/* global doProflevelPostback, doSchedulePostback, doProflevelPostback, doResetRubricPostback, doResetSearchMode, doSchedulePostback */

(() => {

	function clearSalary() {
		$('input[id$="txtSalaryFrom"]').val('');
		$('input[id$="txtSalaryFrom"]').trigger('onchange');
		doProflevelPostback();
	}

	function clearSchedule() {
		$('input[type=checkbox][name=chkSchedule]').each(function() {
			$(this).prop('checked', false);	
		})
		doSchedulePostback();
	}

	function clearProfLevel() {
		$('input[type=checkbox][name=chkProflevel]').each(function() {
			$(this).prop('checked', false);
		})
		doProflevelPostback();
	}

	function clearAllHandler(e) {
		e.preventDefault();
		const redirUrl = `${window.location.protocol}//${window.location.hostname + window.location.pathname}`
		window.location = redirUrl;
	}

 
	$('#salary_label_close').on('click', clearSalary);
	$('#rubrics_label_close').on('click', () => doResetRubricPostback());
	$('#schedule_label_close').on('click', clearSchedule);
	$('#proflevel_label_close').on('click', clearProfLevel);
    $('#special_label_close').on('click', () => doResetSearchMode());
    $('#clear_all_labels').on('click', clearAllHandler);



	$(document).ready(function($) {
	
		const scheduleValues = $('.f-searchlabels-label.-schedule p span');
		const profLevelValues = $('.f-searchlabels-label.-proflevel p span');

		if( scheduleValues.length > 0 ) {
			const scheduleArr = fragmentationLabel( scheduleValues );
			if( scheduleArr ) scheduleArr.map((txt) => createNewLabel(txt));
		}
		
		if( profLevelValues.length > 0 ) {
			const profLevelArr = fragmentationLabel( profLevelValues );
			if( profLevelArr ) profLevelArr.map((txt) => createNewLabel(txt));
		}


		$('.f-searchlabels-label.-template').on('click', '.separate_rubric_label_close', separateLabelsHandler);
		showClearAllLink();


		// Sticky Sidebar
		/* Sticky-kit v1.1.2 | WTFPL | Leaf Corcoran 2015 | http://leafo.net */
		(function(){var b,f;b=this.jQuery||window.jQuery;f=b(window);b.fn.stick_in_parent=function(d){var A,w,J,n,B,K,p,q,k,E,t;null==d&&(d={});t=d.sticky_class;B=d.inner_scrolling;E=d.recalc_every;k=d.parent;q=d.offset_top;p=d.spacer;w=d.bottoming;null==q&&(q=0);null==k&&(k=void 0);null==B&&(B=!0);null==t&&(t="is_stuck");A=b(document);null==w&&(w=!0);J=function(a,d,n,C,F,u,r,G){var v,H,m,D,I,c,g,x,y,z,h,l;if(!a.data("sticky_kit")){a.data("sticky_kit",!0);I=A.height();g=a.parent();null!=k&&(g=g.closest(k));
		if(!g.length)throw"failed to find stick parent";v=m=!1;(h=null!=p?p&&a.closest(p):b("<div />"))&&h.css("position",a.css("position"));x=function(){var c,f,e;if(!G&&(I=A.height(),c=parseInt(g.css("border-top-width"),10),f=parseInt(g.css("padding-top"),10),d=parseInt(g.css("padding-bottom"),10),n=g.offset().top+c+f,C=g.height(),m&&(v=m=!1,null==p&&(a.insertAfter(h),h.detach()),a.css({position:"",top:"",width:"",bottom:""}).removeClass(t),e=!0),F=a.offset().top-(parseInt(a.css("margin-top"),10)||0)-q,
		u=a.outerHeight(!0),r=a.css("float"),h&&h.css({width:a.outerWidth(!0),height:u,display:a.css("display"),"vertical-align":a.css("vertical-align"),"float":r}),e))return l()};x();if(u!==C)return D=void 0,c=q,z=E,l=function(){var b,l,e,k;if(!G&&(e=!1,null!=z&&(--z,0>=z&&(z=E,x(),e=!0)),e||A.height()===I||x(),e=f.scrollTop(),null!=D&&(l=e-D),D=e,m?(w&&(k=e+u+c>C+n,v&&!k&&(v=!1,a.css({position:"fixed",bottom:"",top:c}).trigger("sticky_kit:unbottom"))),e<F&&(m=!1,c=q,null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),
		h.detach()),b={position:"",width:"",top:""},a.css(b).removeClass(t).trigger("sticky_kit:unstick")),B&&(b=f.height(),u+q>b&&!v&&(c-=l,c=Math.max(b-u,c),c=Math.min(q,c),m&&a.css({top:c+"px"})))):e>F&&(m=!0,b={position:"fixed",top:c},b.width="border-box"===a.css("box-sizing")?a.outerWidth()+"px":a.width()+"px",a.css(b).addClass(t),null==p&&(a.after(h),"left"!==r&&"right"!==r||h.append(a)),a.trigger("sticky_kit:stick")),m&&w&&(null==k&&(k=e+u+c>C+n),!v&&k)))return v=!0,"static"===g.css("position")&&g.css({position:"relative"}),
		a.css({position:"absolute",bottom:d,top:"auto"}).trigger("sticky_kit:bottom")},y=function(){x();return l()},H=function(){G=!0;f.off("touchmove",l);f.off("scroll",l);f.off("resize",y);b(document.body).off("sticky_kit:recalc",y);a.off("sticky_kit:detach",H);a.removeData("sticky_kit");a.css({position:"",bottom:"",top:"",width:""});g.position("position","");if(m)return null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),h.remove()),a.removeClass(t)},f.on("touchmove",l),f.on("scroll",l),f.on("resize",
		y),b(document.body).on("sticky_kit:recalc",y),a.on("sticky_kit:detach",H),setTimeout(l,0)}};n=0;for(K=this.length;n<K;n++)d=this[n],J(b(d));return this}}).call(this);

		// $('.f-vacancylist-wrap').attr('data-sticky_parent', '');
		// $('.f-vacancylist-leftwrap').attr('data-sticky_column', '');
		// $('.f-vacancylist-rightwrap-inner').attr('data-sticky_column', '');

		// $('.f-vacancylist-rightwrap-inner').stick_in_parent({
		// 	offset_top: 63
		// });
	



	

	});

	function fragmentationLabel(elem) {
		if( elem.length > 0 ) {
			return $(elem).text().trim().split(',');
		}
		return false;
	}

	function createNewLabel(name = '') {
		const template = $("#label_template").clone().removeClass('-hidden');
		$(template).removeAttr('id');
		$(template).find('p span').text(name);
		template.insertBefore('.f-searchlabels-label-clearlink');

		showClearAllLink();
	}

	function separateLabelsHandler(e) {

		let labelText = $(e.delegateTarget).text();

		// make first letter is uppercase
		labelText = labelText.charAt(0).toUpperCase() + labelText.substring(1);
		const checkboxesArr = $('.chckbx_block').find(`.chckbx_txt`);
		let targetCheckbox;

		// search target checkbox by text
		$(checkboxesArr).filter(function() {
			if ( $(this).text().trim() == labelText.trim() ) {
				targetCheckbox = $(this);
			}
		})

		// for radio Schedules
		if( $(targetCheckbox).hasClass('-radio') ) {
			const siblingRadio = $(targetCheckbox).siblings('input[type="radio"]');
			siblingRadio.prop('checked', false);
			doSchedulePostback();
		}

		// for checkboxes
		else {
			$(targetCheckbox).trigger('click');
		}
	}

	function showClearAllLink() {
		const labelsCount = $('.f-searchlabels-label:not("#label_template, .-hidden")').length;
		if (labelsCount >= 2)
			$('.f-searchlabels-label-clearlink').removeClass('-hidden'); // show clearAll link!
	}

})()