CREATE DATABASE AppLogger;
GO
USE AppLogger;
Go

CREATE TABLE dbo.Application(
	ApplicationID INT IDENTITY PRIMARY KEY NOT NULL,
	Application NVARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE dbo.LogLevel (
	LogLevelID INT IDENTITY PRIMARY KEY NOT NULL,
	LogLevel NVARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE dbo.[User] (
		UserID INT IDENTITY PRIMARY KEY NOT NULL,
		[User] NVARCHAR(50) UNIQUE NOT NULL
)

CREATE TABLE dbo.Error (
	ErrorID INT IDENTITY PRIMARY KEY NOT NULL,
	ErrorMessage NVARCHAR(MAX) NOT NULL,
	ErrorType NVARCHAR(MAX) 
)

CREATE TABLE dbo.Route (
	RouteID INT IDENTITY PRIMARY KEY NOT NULL,
	Route NVARCHAR(250) UNIQUE NOT NULL,
	Method NVARCHAR(15) NULL
)

CREATE TABLE dbo.Method (
	MethodID INT IDENTITY PRIMARY KEY NOT NULL,
	Method NVARCHAR(MAX) NOT NULL
)

CREATE TABLE dbo.Log (
	LogID INT IDENTITY PRIMARY KEY NOT NULL,
	ApplicationID INT REFERENCES dbo.Application(ApplicationID) NOT NULL,
	LogLevelID INT REFERENCES dbo.LogLevel(LogLevelID) NOT NULL,
	UserID INT REFERENCES dbo.[User](UserID) NULL,
	ErrorID INT REFERENCES dbo.Error(ErrorID) NULL,
	MethodID INT REFERENCES dbo.Method(MethodID) NULL,
	RouteID INT REFERENCES dbo.Route(RouteID) NULL,
	TimeOccured DATETIME2 DEFAULT(CURRENT_TIMESTAMP) NOT NULL
)

INSERT INTO dbo.LogLevel
	(LogLevel)
VALUES
	(N'Info'),
	(N'Warning'),
	(N'Error');