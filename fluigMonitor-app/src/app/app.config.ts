abstract class AppSetting {
    public static APP_ROOT = [(window as any) ['_app_baseUrl']];
    public static APP_PAGE_CODE = (window as any) ['_app_pageCode'];
    public static APP_SERVER = (window as any) ['_app_serverUrl'];

    public static APP_BASE = 
        AppSetting.APP_ROOT && AppSetting.APP_PAGE_CODE
            ? AppSetting.APP_ROOT + '/' + AppSetting.APP_PAGE_CODE
            : '';
}
export { AppSetting as APP_CONFIG };