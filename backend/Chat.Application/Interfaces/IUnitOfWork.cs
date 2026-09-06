namespace Chat.Application.Interfaces;
public interface IUnitOfWork
{
    Task SaveChangesAsync();
}
