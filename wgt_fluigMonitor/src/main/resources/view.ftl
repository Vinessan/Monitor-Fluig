<div id="MyWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyWidget.instance()">
	<link rel="stylesheet" href="/wgt_fluigMonitor/resources/js/app-angular/styles.css"></link>
	
	<app-root></app-root>

	<script>
		(function setEnvironmentParams() {
			const protectedContextPath = '${protectedContextPath!""}';
			const contextPath = '${contextPath!""}';
			
			let baseUrl = protectedContextPath + '/${tenantCode!""}';
			let serverUrl = '${serverURL!""}'
			
			if (window.location.href.indexOf(protectedContextPath) === -1) {
				baseUrl = baseUrl.replace(protectedContextPath, contextPath)
			}
			
			window['_app_baseUrl'] = baseUrl;
			window['_app_serverUrl'] = serverUrl;
			window['_app_pageCode'] = '${(pageCode!"")}'
		})();
	</script>
	
	<script src="/wgt_fluigMonitor/resources/js/app-angular/runtime.js" type="module"></script>
	<script src="/wgt_fluigMonitor/resources/js/app-angular/polyfills.js" type="module"></script>
	<script src="/wgt_fluigMonitor/resources/js/app-angular/main.js" type="module"></script>
</div>

