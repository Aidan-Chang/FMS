using SMBLibrary;
using SMBLibrary.Client;
using System.Net;

namespace Test.Base;

public class Tests {
  [SetUp]
  public void Setup() { }

  [Test]
  public void Test1() {
    SMB2Client client = new();
    bool isConnected = client.Connect(IPAddress.Parse("10.1.1.4"), SMBTransportType.DirectTCPTransport);
    if (isConnected) {
      var status = client.Login("MACHANGP", "RPA", "9KzZ3VhWGRAZwe");
      if (status == NTStatus.STATUS_SUCCESS) {
        ISMBFileStore fileStore = client.TreeConnect("品保", out status);
        object? directoryHandle;
        FileStatus fileStatus;
        status = fileStore.CreateFile(out directoryHandle, out fileStatus, "總廠品保\\03.成品出貨照片\\成品照片\\工具箱\\", AccessMask.GENERIC_READ, SMBLibrary.FileAttributes.Directory, ShareAccess.Read | ShareAccess.Write, CreateDisposition.FILE_OPEN, CreateOptions.FILE_DIRECTORY_FILE, null);
        if (status == NTStatus.STATUS_SUCCESS) {
          List<QueryDirectoryFileInformation> fileList;
          status = fileStore.QueryDirectory(out fileList, directoryHandle, "*", FileInformationClass.FileDirectoryInformation);
          status = fileStore.CloseFile(directoryHandle);
        }
      }
    }
    Assert.Pass();
  }
}
