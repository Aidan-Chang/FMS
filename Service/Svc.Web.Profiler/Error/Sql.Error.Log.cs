using ElmahCore;

namespace FMS.Svc.Web.Profiler.Error;

public class SqlErrorLog : ErrorLog {

  public override string Name => "Sql Error Log";

  public override ErrorLogEntry GetError(string id) {
    throw new NotImplementedException();
  }

  public override int GetErrors(int errorIndex, int pageSize, ICollection<ErrorLogEntry> errorEntryList) {
    throw new NotImplementedException();
  }

  public override string Log(ElmahCore.Error error) {
    throw new NotImplementedException();
  }

  public override void Log(Guid id, ElmahCore.Error error) {
    throw new NotImplementedException();
  }

}
