using Microsoft.AspNetCore.Mvc;

namespace Chat.API.Middlewares;
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    public ExceptionHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (InvalidCredentialsException ex)
        {
            await WriteError(context, StatusCodes.Status401Unauthorized, "Unauthorized", ex.Message);
        }
        catch (RefreshTokenNotFoundException ex)
        {
            await WriteError(context, StatusCodes.Status401Unauthorized, "Unauthorized", ex.Message);
        }
        catch (RefreshTokenExpiredException ex)
        {
            await WriteError(context, StatusCodes.Status401Unauthorized, "Unauthorized", ex.Message);
        }
        catch (RefreshTokenRevokedException ex)
        {
            await WriteError(context, StatusCodes.Status401Unauthorized, "Unauthorized", ex.Message);
        }
        catch (InvalidRefreshTokenException ex)
        {
            await WriteError(context, StatusCodes.Status401Unauthorized, "Unauthorized", ex.Message);
        }
        catch (UserNotFoundException ex)
        {
            await WriteError(context, StatusCodes.Status404NotFound, "UserNotFound", ex.Message);
        }
        catch (ChatNotFoundException ex)
        {
            await WriteError(context, StatusCodes.Status404NotFound, "ChatNotFound", ex.Message);
        }
        catch (ChatAccessDeniedException ex)
        {
            await WriteError(context, StatusCodes.Status403Forbidden, "Forbidden", ex.Message);
        }
        catch (Exception)
        {
            await WriteError(context, StatusCodes.Status500InternalServerError, "InternalServerError", "Internal server error");
        }
    }

    private static async Task WriteError(HttpContext context, int statusCode, string title, string message)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        await context.Response.WriteAsJsonAsync(new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = message
        });
    }
}
