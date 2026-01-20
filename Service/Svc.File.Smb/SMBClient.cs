using SMBLibrary;
using SMBLibrary.Client;
using System.Net;

namespace FMS.Svc.File.Smb;

public class SMBClient {

  private string _ipAddress = string.Empty;
  private string _domainName = string.Empty;
  private string _userName = string.Empty;
  private string _password = string.Empty;
  private string _basePath = string.Empty;
  private static object _locker = new object();

  public SMBClient(string ipAddress, string domainName, string userName, string password, string basePath){
    _ipAddress = ipAddress;
    _domainName = domainName;
    _userName = userName;
    _password = password;
    _basePath = basePath;
  }

  private SMB2Client? createClient() {
    SMB2Client client = new SMB2Client();
    bool isConnected = client.Connect(IPAddress.Parse(_ipAddress), SMBTransportType.DirectTCPTransport);
    if (isConnected) {
      NTStatus status = client.Login(_domainName, _userName, _password);
      if (status == NTStatus.STATUS_SUCCESS) {
        return client;
      }
    }
    return null;
  }

  public List<FileDirectoryInformation?>? GetList(string relativePath) {
    lock (_locker) {
      SMB2Client? client = createClient();
      List<FileDirectoryInformation?>? data = null;
      if (client != null) {
        ISMBFileStore fileStore = client.TreeConnect(_basePath, out NTStatus status);
        status = fileStore.CreateFile(out object handle, out FileStatus fileStatus, relativePath, AccessMask.GENERIC_READ, SMBLibrary.FileAttributes.Directory, ShareAccess.Read | ShareAccess.Write, CreateDisposition.FILE_OPEN, CreateOptions.FILE_DIRECTORY_FILE, null);
        if (status == NTStatus.STATUS_SUCCESS) {
          status = fileStore.QueryDirectory(out List<QueryDirectoryFileInformation> fileList, handle, "*", FileInformationClass.FileDirectoryInformation);
          data = fileList.Select(x => (x as FileDirectoryInformation))
            .Where(file => {
              if (file != null)
                return !(file.FileName == "." || file.FileName == "..");
              return false;
            })
            .OrderBy(file => file?.FileAttributes)
            .ThenBy(file => file?.FileName)
            .ToList();
        }
        status = fileStore.CloseFile(handle);
        status = fileStore.Disconnect();
        client.Disconnect();
      }
      return data;
    }
  }

  public byte[]? GetFile(string relativePath) {
    lock (_locker) {
      SMB2Client? client = createClient();
      byte[]? data = null;
      if (client != null) {
        ISMBFileStore fileStore = client.TreeConnect(_basePath, out NTStatus status);
        status = fileStore.CreateFile(out object handle, out FileStatus fileStatus, relativePath, AccessMask.GENERIC_READ | AccessMask.SYNCHRONIZE, SMBLibrary.FileAttributes.Normal, ShareAccess.Read, CreateDisposition.FILE_OPEN, CreateOptions.FILE_NON_DIRECTORY_FILE | CreateOptions.FILE_SYNCHRONOUS_IO_ALERT, null);
        if (status == NTStatus.STATUS_SUCCESS) {
          using MemoryStream ms = new();
          long bytesRead = 0;
          while (true) {
            status = fileStore.ReadFile(out byte[] content, handle, bytesRead, (int)client.MaxReadSize);
            if (status != NTStatus.STATUS_SUCCESS && status != NTStatus.STATUS_END_OF_FILE)
              break;
            if (status == NTStatus.STATUS_END_OF_FILE || content.Length == 0)
              break;
            bytesRead += content.Length;
            ms.Write(content, 0, content.Length);
          }
          data = ms.ToArray();
          status = fileStore.CloseFile(handle);
        }
        status = fileStore.Disconnect();
        client.Disconnect();
      }
      return data;
    }
  }

  public bool SaveFile(string relativePath, byte[] data) {
    lock (_locker) {
      SMB2Client? client = createClient();
      bool result = false;
      if (client != null) {
        ISMBFileStore fileStore = client.TreeConnect(_basePath, out NTStatus status);        
        status = fileStore.CreateFile(out object handle, out FileStatus fileStatus, relativePath, AccessMask.GENERIC_WRITE | AccessMask.SYNCHRONIZE, SMBLibrary.FileAttributes.Normal, ShareAccess.None, CreateDisposition.FILE_CREATE, CreateOptions.FILE_NON_DIRECTORY_FILE | CreateOptions.FILE_SYNCHRONOUS_IO_ALERT, null);
        if (status == NTStatus.STATUS_SUCCESS) {
          long writeOffset = 0;
          using MemoryStream ms = new MemoryStream(data);
          while (ms.Position < ms.Length) {
            byte[] buffer = new byte[(int)client.MaxWriteSize];
            int bytesRead = ms.Read(buffer, 0, buffer.Length);
            if (bytesRead < (int)client.MaxWriteSize) {
              Array.Resize<byte>(ref buffer, bytesRead);
            }
            status = fileStore.WriteFile(out int numberOfBytesWritten, handle, writeOffset, buffer);
            if (status != NTStatus.STATUS_SUCCESS) {
              break;
            }
            writeOffset += bytesRead;
          }
          result = status == NTStatus.STATUS_SUCCESS;
          status = fileStore.CloseFile(handle);
        }
        status = fileStore.Disconnect();
        client.Disconnect();
      }
      return result;
    }
  }

  public bool CreateDirectory(string relativePath) {
    lock (_locker) {
      SMB2Client? client = createClient();
      bool result = false;
      if (client != null) {
        ISMBFileStore fileStore = client.TreeConnect(_basePath, out NTStatus status);
        status = fileStore.CreateFile(out object handle, out FileStatus fileStatus, relativePath, AccessMask.GENERIC_WRITE | AccessMask.SYNCHRONIZE, SMBLibrary.FileAttributes.Directory, ShareAccess.None, CreateDisposition.FILE_CREATE, CreateOptions.FILE_DIRECTORY_FILE | CreateOptions.FILE_SYNCHRONOUS_IO_ALERT, null);
        result = status == NTStatus.STATUS_SUCCESS;
        status = fileStore.CloseFile(handle);
        status = fileStore.Disconnect();
      }
      return result;
    }
  }
}
