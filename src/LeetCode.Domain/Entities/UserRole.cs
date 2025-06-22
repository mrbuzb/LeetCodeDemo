namespace LeetCode.Domain.Entities;

public class UserRole
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    public ICollection<User> Users { get; set; }
}
