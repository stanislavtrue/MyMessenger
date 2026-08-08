namespace Chat.Domain.Interfaces;
public interface IUnitOfWork
{
    Task SaveChangesAsync();
}
