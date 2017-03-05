# *Seasoned*: an intelligent organizer for your shows

## Architecture
The flow of the system will first check for new folders in your tv shows directory, if a new file is found it's contents are analyzed, stored and tweets suggested changes to it's contents to use_admin. 

Then there is a script for looking for replies on twitter by user_admin, if caanges are needed, it handles the changes specified and updates dtabbase. 

After approval by user the files are modified and moved to folders in resptected area. If error occours, pasteee link if log is sent to user.


