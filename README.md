# 🌶 seasonedShows : Your customly seasoned movie and show requester, downloader and organizer

*seasonedShows* is a intelligent organizer for your tv show episodes. It is made to automate and simplify to process of renaming and moving newly downloaded tv show episodes following Plex file naming and placement. 

## Architecture
The flow of the system will first check for new folders in your tv shows directory, if a new file is found it's contents are analyzed, stored and tweets suggested changes to it's contents to use_admin.

Then there is a script for looking for replies on twitter by user_admin, if caanges are needed, it handles the changes specified and updates dtabbase.

After approval by user the files are modified and moved to folders in resptected area. If error occours, pasteee link if log is sent to user.

#### External
 + Seasoned: request, discover and manage.
 + Stray: Overview of downloaded episodes before they are organized.
 + (+) Admin Panel: Overview of all stray episodes/movies.

#### Api
 + All communication between public website to server.
 + Plex: All querying to what is localy available in your plex library. 
 + Stray (seasoned) -> also calls services (moveStray) through api.
 + Tmdb: Requesting information from tmdb.
 + (+) Admin Panel: Use secure login and session tokens to handle logged in viewer. 

#### Services
 + Parse directories for new content.
 + Extract and save in db information about stray item.
 + Move a confirmed stray item.
 + (+) Search for torrents matching new content.