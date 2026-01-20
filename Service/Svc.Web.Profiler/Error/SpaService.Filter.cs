using ElmahCore;
using System.Diagnostics;

namespace FMS.Svc.Web.Profiler.Error;

[DebuggerStepThrough]
public class SpaServiceFilter : IErrorFilter {

  [DebuggerHidden]
  public void OnErrorModuleFiltering(object sender, ExceptionFilterEventArgs e) {
    if (e.Exception.Source == "Microsoft.AspNetCore.SpaServices.Extensions") {
      e.Dismiss();
    }
  }

}